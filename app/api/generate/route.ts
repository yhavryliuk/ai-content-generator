import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const FREE_POST_LIMIT = 3;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (dbUser.plan === "FREE") {
    const postCount = await prisma.post.count({
      where: { authorId: user.id },
    });

    if (postCount >= FREE_POST_LIMIT) {
      return NextResponse.json(
        { error: "upgrade_required", used: postCount, limit: FREE_POST_LIMIT },
        { status: 403 }
      );
    }
  }

  let body: { topic: string; platform: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { topic, platform } = body;

  if (!topic || !platform) {
    return NextResponse.json(
      { error: "topic and platform are required" },
      { status: 400 }
    );
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are a professional social media content creator. Write a compelling ${platform} post about the given topic. ${
          platform === "Twitter"
            ? "Keep it under 280 characters."
            : "Write a detailed, engaging post with proper formatting."
        }`,
      },
      {
        role: "user",
        content: `Write a ${platform} post about: ${topic}`,
      },
    ],
  });

  let fullContent = "";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) {
          fullContent += text;
          controller.enqueue(encoder.encode(text));
        }
      }

      // Save the completed post to the database
      try {
        await prisma.post.create({
          data: {
            content: fullContent,
            platform,
            topic,
            authorId: user.id,
          },
        });
      } catch (err) {
        console.error("Failed to save post:", err);
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

import { prisma } from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { MarkdownContent } from "@/features/generator/components/markdown-content";
import { getCurrentUser } from "@/shared/services/get-current-user";

export default async function HistoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      topic: true,
      platform: true,
      content: true,
      createdAt: true,
    },
  });

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">No posts generated yet.</p>
        <p className="text-sm text-muted-foreground">
          Head to the Generator to create your first post.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <h2 className="text-2xl font-bold">Post History</h2>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{post.topic}</CardTitle>
              <Badge variant="outline">{post.platform}</Badge>
            </div>
            <CardDescription>
              {post.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownContent content={post.content} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

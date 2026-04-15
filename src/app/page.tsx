import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Shield, PenLine } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          <span className="text-lg font-semibold">AI Content Gen</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button render={<Link href="/login" />}>
            Get Started
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20 text-center">
        <Badge variant="secondary" className="text-sm">
          Powered by GPT-4o mini
        </Badge>

        <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight">
          Generate Compelling Content{" "}
          <span className="text-primary">in Seconds</span>
        </h1>

        <p className="max-w-lg text-lg text-muted-foreground">
          Create professional LinkedIn and Twitter posts with AI. Just enter
          your topic and let our AI craft the perfect post for you.
        </p>

        <div className="flex gap-4">
          <Button size="lg" render={<Link href="/login" />}>
            Start for Free
            <Sparkles />
          </Button>
        </div>

        <div className="mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
            <Zap className="size-8 text-primary" />
            <h3 className="font-semibold">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Stream AI-generated content in real-time. See your post come to
              life word by word.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
            <PenLine className="size-8 text-primary" />
            <h3 className="font-semibold">Multi-Platform</h3>
            <p className="text-sm text-muted-foreground">
              Optimized for LinkedIn and Twitter. Each post is tailored to the
              platform&apos;s best practices.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
            <Shield className="size-8 text-primary" />
            <h3 className="font-semibold">3 Free Posts</h3>
            <p className="text-sm text-muted-foreground">
              Try it out with 3 free posts. Upgrade to PRO for unlimited
              generation.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        Built with Next.js, Supabase, Prisma &amp; Stripe
      </footer>
    </div>
  );
}

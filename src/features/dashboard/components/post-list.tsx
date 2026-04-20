import { prisma } from "@/shared/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { MarkdownContent } from "@/features/generator/components/markdown-content";

interface PostListProps {
	userId: string;
}

export async function PostList({ userId }: PostListProps) {

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
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
    return <p className="text-muted-foreground text-center py-10">No posts yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
             <div className="flex items-center justify-between">
              <CardTitle className="text-base">{post.topic}</CardTitle>
              <Badge variant="outline">{post.platform}</Badge>
            </div>
            <CardDescription>{post.createdAt.toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownContent content={post.content} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export function PostListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-50 w-full animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

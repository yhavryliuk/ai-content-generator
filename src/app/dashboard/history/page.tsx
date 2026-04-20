import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/shared/services/get-current-user";
import { PostList, PostListSkeleton } from "@/features/dashboard/components/post-list";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <h2 className="text-2xl font-bold">Post History</h2>

      <Suspense fallback={<PostListSkeleton />}>
        <PostList userId={user.id} />
      </Suspense>
    </div>
  );
}


"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMount } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { useRetrieveProfileQuery } from "@/redux/features/profileSlice";
import { MiniPost, Comment, CommentForm } from "@/components/post";
import { ViewPost } from "@/components/post";
import { useRetrievePostQuery } from "@/redux/features/postSlice";
import { Post } from "@/lib/exports";

interface Props {
  postId: number;
  post: Post;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export default function CommentView({ postId, post }: Props) {
  const { data } = useRetrieveProfileQuery();
  const { refetch } = useRetrievePostQuery(postId);
  const pathname = usePathname();
  const isPostModal = pathname === `/dashboard/c/${postId}`;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const mount = useMount();

  if (!mount) return null;
  refetch();

  return (
    <Dialog open={isPostModal} onOpenChange={(open) => !open && router.back()}>
      <DialogContent className="flex flex-col md:flex-row items-start p-0 w-full max-w-md h-full max-h-[500px]">
        <div className="flex flex-col justify-between md:h-full md:order-2 w-full h-full">
          <DialogHeader className="flex border-b space-y-0 space-x-2.5 flex-row items-center py-4 pl-3.5 pr-6">
            <MiniPost post={post} />
          </DialogHeader>

          <ScrollArea className="border-b flex-grow overflow-y-auto max-h-[350px] md:max-h-[350px]">
            {post.comments_count > 0 && (
              <>
                {post.comments
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((comment) => {
                    return (
                      <Comment
                        key={comment.id}
                        comment={comment}
                        inputRef={inputRef}
                      />
                    );
                  })}
              </>
            )}
          </ScrollArea>

          <div className="flex flex-col mt-auto w-full">
            <div className="px-2 flex justify-between items-center border-b p-2.5">
              <time className="text-[11px] uppercase text-zinc-500 font-medium">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <ViewPost href={`/dashboard/p/${post.id}`} className="ml-auto" />
            </div>
          </div>

          <CommentForm
            postId={post.id}
            profilePic={data?.profile.profile_picture}
            className="mt-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

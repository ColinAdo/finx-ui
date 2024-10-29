"use client";

import { cn } from "@/lib/utils";
import { FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/post";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { Post } from "@/lib/exports";
import {
  useDeletePostMutation,
  useGetPostQuery,
} from "@/redux/features/postSlice";

interface Props {
  post: Post;
  userId?: number;
  className?: string;
}

export default function PostOptions({ post, className }: Props) {
  const [deletePost] = useDeletePostMutation();
  const { refetch } = useGetPostQuery();

  const { data: user } = useRetrieveUserQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isPostMine = post.author.id === user?.id;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await deletePost(post.id).unwrap();
      refetch();
      toast.success("Post deleted successfully");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Error deleting post");
      console.error("Error deleting post:", error);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <MoreHorizontal
          className={cn(
            "h-5 w-5 cursor-pointer dark:text-neutral-400",
            className
          )}
        />
      </DialogTrigger>
      <DialogContent className="dialogContent">
        {isPostMine && (
          <form onSubmit={handleSubmit} className="postOption">
            <input type="hidden" name="id" value={post.id} />
            <SubmitButton className="text-red-500 font-bold disabled:cursor-not-allowed w-full p-3">
              Delete post
            </SubmitButton>
          </form>
        )}

        {isPostMine && (
          <Link
            scroll={false}
            href={`/dashboard/p/${post.id}/edit`}
            className="postOption p-3"
          >
            Edit
          </Link>
        )}

        <form action="" className="postOption border-0">
          <button className="w-full p-3">Hide like count</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

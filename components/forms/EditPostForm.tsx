"use client";

import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, FormEvent } from "react";
import { useMount } from "@/hooks";
import { toast } from "sonner";
import { FormButton, Spinner } from "@/components/common";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/exports";
import {
  useUpdatePostMutation,
  useGetPostQuery,
} from "@/redux/features/postSlice";

interface Props {
  post: Post;
}

export default function EditPostForm({ post }: Props) {
  const [updatePost, { isLoading }] = useUpdatePostMutation();
  const { refetch } = useGetPostQuery();
  const router = useRouter();
  const mount = useMount();

  const [caption, setCaption] = useState(post.caption || "");

  if (!mount) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await updatePost({
        postId: post.id,
        caption,
      }).unwrap();

      refetch();
      router.push("/dashboard");
      toast.success("Post updated successfully!");
    } catch (error) {
      toast.error("Failed to update the post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {post?.fileUrl && (
        <div className="h-80 md:h-[400px] overflow-hidden rounded-md">
          <AspectRatio ratio={1 / 1} className="relative h-full">
            {post?.fileUrl.endsWith(".mp4") ? (
              <video
                controls
                className="rounded-md object-cover"
                width="100%"
                height="auto"
              >
                <source src={post?.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={post?.fileUrl}
                alt="Post preview"
                fill
                className="rounded-md object-cover"
              />
            )}
          </AspectRatio>
        </div>
      )}

      <div>
        <label
          htmlFor="caption"
          className="block text-sm font-bold my-2 text-black dark:text-white"
        >
          Caption
        </label>
        <input
          type="text"
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex justify-between">
        <FormButton btnType="submit" disabled={isLoading}>
          {isLoading ? <Spinner sm /> : "Update Post"}
        </FormButton>
      </div>
    </form>
  );
}

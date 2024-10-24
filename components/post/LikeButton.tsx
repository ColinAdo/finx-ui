"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { FormEvent, useEffect, useState } from "react";
import { ActionIcons } from "@/components/post";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import {
  useLikePostMutation,
  useGetPostQuery,
} from "@/redux/features/postSlice";

interface User {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
}

interface Comment {
  id: number;
  owner: User;
  post: number;
  comment: string | null;
  comment_image?: string | null;
  created_at: Date;
}

interface Like {
  id: number;
  user: User;
  post: number;
  created_at: Date | null;
}

interface Bookmark {
  id: number;
  user: User;
  post: number;
  created_at: Date | null;
}

interface Post {
  id: number;
  author: User;
  fileUrl: string;
  caption: string | null;
  created_at: Date;
  comments: Comment[];
  comments_count: number;
  likes: Like[];
  likes_count: number;
  bookmarks: Bookmark[];
  bookmark_count: number;
}

export default function LikeButton({ post }: { post: Post }) {
  const [likePost] = useLikePostMutation();
  const { refetch } = useGetPostQuery();
  const { data } = useRetrieveUserQuery();

  const initialLiked = post.likes.some((like) => like.user.id === data?.id);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await likePost(post.id).unwrap();
      refetch();
    } catch (error) {
      toast.error("Error liking post");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="post" value={post.id} />

        <ActionIcons>
          <Heart
            className={cn("h-6 w-6", {
              "text-red-500 fill-red-500": initialLiked,
              "dark:text-gray-100 text-gray-950": !initialLiked,
            })}
          />
        </ActionIcons>
      </form>
      {post.likes_count > 0 && (
        <p className="text-sm font-bold dark:text-white">{post.likes_count}</p>
      )}
    </div>
  );
}

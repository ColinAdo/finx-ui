"use client";

import Link from "next/link";
import Timestamp from "./Timestamp";
import { PostOptions } from "@/components/post";
import { UserAvatar } from "@/components/common";
import { Post } from "@/lib/exports";

interface Props {
  post: Post;
}

export default function MiniPost({ post }: Props) {
  const username = post.author.username;
  const href = `/dashboard/${username}`;

  return (
    <div className="group flex items-start space-x-2.5">
      <Link href={href}>
        <UserAvatar user={post.author} />
      </Link>
      <div className="flex-1">
        <div className="flex items-center justify-between space-x-1.5 leading-none text-sm">
          <Link href={href} className="font-semibold mx-0">
            {username}
          </Link>
          <small>{post.comments_count > 1 && "Comments"}</small>
          <div className="flex items-center space-x-2.5">
            <Timestamp createdAt={post.created_at} />
            <PostOptions
              post={post}
              userId={post.author.id}
              className="hidden group-hover:inline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

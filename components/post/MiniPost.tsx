"use client";

import Link from "next/link";
import { PostOptions } from "@/components/post";
import { UserAvatar } from "@/components/common";
import Timestamp from "./Timestamp";

interface ProfileData {
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
  owner: ProfileData;
  post: number;
  comment: string | null;
  comment_image?: string | null;
  created_at: Date;
}

interface Like {
  id: number;
  user: ProfileData;
  post: number;
  created_at: Date | null;
}

interface Bookmark {
  id: number;
  user: ProfileData;
  post: number;
  created_at: Date | null;
}

interface Post {
  id: number;
  author: ProfileData;
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

interface Props {
  post: Post;
}

export default function MiniPost({ post }: Props) {
  const username = post.author.profile.username;
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
              userId={post.author.profile.id}
              className="hidden group-hover:inline"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

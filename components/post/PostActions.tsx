import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import {
  LikeButton,
  ActionIcons,
  ShareButton,
  BookmarkButton,
} from "@/components/post";

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

interface Props {
  post: Post;
  className?: string;
}

export default function PostActions({ post, className }: Props) {
  return (
    <div className={cn("relative flex items-start w-full gap-x-2", className)}>
      <LikeButton post={post} />
      <div className="flex items-center space-x-2">
        <Link
          href={
            post.comments_count > 0
              ? `/dashboard/c/${post.id}`
              : `/dashboard/p/${post.id}`
          }
        >
          <ActionIcons>
            <MessageCircle className={"h-6 w-6"} />
          </ActionIcons>
        </Link>
        {post.comments_count > 0 && (
          <p className="text-sm font-bold dark:text-white">
            {post.comments_count}
          </p>
        )}
      </div>
      <ShareButton postId={post.id} />
      <BookmarkButton post={post} />
    </div>
  );
}

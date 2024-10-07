"use client";

import { PostActions, PostOptions } from "@/components/post";
import { UserAvatar } from "@/components/common";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMount } from "@/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Comment, CommentForm } from "@/components/post";
import { useRetrievePostQuery } from "@/redux/features/postSlice";
import { useRetrieveProfileQuery } from "@/redux/features/profileSlice";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface User {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
}

interface PostComment {
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
  comments: PostComment[];
  comments_count: number;
  likes: Like[];
  likes_count: number;
  bookmarks: Bookmark[];
  bookmark_count: number;
}

interface Props {
  postId: number;
  post: Post;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

export default function PostView({ postId, post }: Props) {
  const { refetch } = useRetrievePostQuery(postId);
  const { data } = useRetrieveProfileQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const mount = useMount();

  if (!mount) return null;
  refetch();

  return (
    <>
      <Card className="w-full md:max-w-3xl lg:max-w-4xl md:flex mx-auto">
        <div className="relative overflow-hidden h-[450px] w-full md:max-w-sm lg:max-w-lg">
          <Image
            src={post.fileUrl}
            alt="Post preview"
            fill
            className="md:rounded-l-md object-cover"
          />
        </div>

        <div className="flex w-full flex-col flex-1">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <HoverCard>
              <HoverCardTrigger asChild className="hidden md:block">
                <Link
                  className="font-semibold text-sm"
                  href={`/dashboard/${post.author.username}`}
                >
                  {post.author.username}
                </Link>
              </HoverCardTrigger>
              <PostOptions post={post} className="hidden md:block" />

              <HoverCardContent>
                <div className="flex items-center space-x-2">
                  <UserAvatar user={post.author} className="h-14 w-14" />
                  <div>
                    <p className="font-bold">{post.author.username}</p>
                    <p className="text-sm font-medium dark:text-neutral-400">
                      {data?.profile.username}
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>

          {post.comments.length === 0 && (
            <div className="hidden md:flex flex-col items-center gap-1.5 flex-1 justify-center">
              <p className="text-xl lg:text-2xl font-extrabold">
                No comments yet.
              </p>
              <p className="text-sm font-medium">Start the conversation.</p>
            </div>
          )}

          {post.comments.length > 0 && (
            <ScrollArea className="hidden md:block flex-1 py-1.5 border-b overflow-y-auto max-h-[300px]">
              {post.comments
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    inputRef={inputRef}
                  />
                ))}
            </ScrollArea>
          )}

          <div className="md:block px-2 mt-auto border-y p-2.5">
            <PostActions post={post} />
            <time className="text-[11px] uppercase text-zinc-500 font-medium">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          <div className="sm:hidden block flex-1 py-1.5 border-b overflow-y-auto max-h-[300px]">
            {post.comments
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .slice(0, 1)
              .map((comment) => (
                <div className="group p-3 px-3.5  flex items-start space-x-2.5">
                  <Link href={`/dashboard/${comment.owner.username}`}>
                    <UserAvatar user={comment.owner} />
                  </Link>
                  <div className="space-y-1.5">
                    <div className="flex my-1 items-center space-x-1.5 leading-none text-sm">
                      <Link
                        href={`/dashboard/${comment.owner.username}`}
                        className="font-semibold"
                      >
                        {comment.owner.username}
                      </Link>
                      <p className="font-medium">{comment.comment}</p>
                    </div>
                    <span className="text-sm font-thin">
                      <Link
                        scroll={false}
                        className="text-sm font-medium text-neutral-500"
                        href={`/dashboard/c/${post.id}`}
                      >
                        read all {post.comments_count}{" "}
                        {post.comments_count > 1 ? "Comments" : "Comment"}
                      </Link>
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <CommentForm
            profilePic={data?.profile.profile_picture}
            postId={post.id}
            className="md:inline-flex"
          />
        </div>
      </Card>
    </>
  );
}

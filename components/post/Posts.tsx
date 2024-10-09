"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PostOptions } from "@/components/post";
import { useGetPostQuery } from "@/redux/features/postSlice";
import { useRetrieveProfileQuery } from "@/redux/features/profileSlice";
import { Avatar } from "@/components/ui/avatar";
import { Timestamp, PostActions, Comments } from "@/components/post";

export default function Post() {
  const { data: user } = useRetrieveProfileQuery();
  const { data: posts } = useGetPostQuery();
  console.log("Post data:", posts);

  if (!posts) {
    return;
  }

  return (
    <div>
      {posts?.map((post) => (
        <div className="flex flex-col space-y-2.5">
          <div className="flex items-center justify-between px-3 sm:px-0">
            <div className="flex space-x-3 items-center">
              <Link href={`/dashboard/${post.author.username}`}>
                <Avatar className="relative h-6 w-6 cursor-pointer">
                  {post.author.profile_picture ? (
                    <Image
                      src={post.author.profile_picture}
                      fill
                      alt={`${post.author.username}'s avatar`}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Image
                      src="/fallback-avatar.png"
                      fill
                      alt="Fallback avatar"
                      className="rounded-full object-cover"
                    />
                  )}
                </Avatar>
              </Link>
              <div className="text-sm">
                <p className="space-x-1">
                  <Link href={`/dashboard/${post.author.username}`}>
                    <span className="font-semibold">
                      {post.author.username}
                    </span>
                  </Link>
                  <span
                    className="font-medium text-neutral-500 dark:text-neutral-400
                      text-xs
                    "
                  >
                    •
                  </span>
                  <Timestamp createdAt={post.created_at} />
                </p>
                <p className="text-xs text-black dark:text-white font-medium">
                  Dubai, United Arab Emirates
                </p>
              </div>
            </div>
            <PostOptions post={post} userId={post.author.id} />
          </div>
          <Card className="relative h-[450px] w-full overflow-hidden rounded-none sm:rounded-md">
            {post.fileUrl ? (
              <Link href={`dashboard/p/${post.id}`}>
                <Image
                  src={post.fileUrl}
                  alt="Post Image"
                  fill
                  className="sm:rounded-md object-cover"
                />
              </Link>
            ) : (
              <Image
                src="/fallback-image.png"
                alt="Fallback Image"
                fill
                className="sm:rounded-md object-cover"
              />
            )}
          </Card>
          <PostActions post={post} className="px-3 sm:px-0" />
          {post.caption && (
            <div className="text-sm leading-none flex items-center space-x-2 font-medium px-3 sm:px-0">
              <p>{post.caption}</p>
            </div>
          )}

          <Comments
            postId={post.id}
            comments={post.comments}
            commentsCount={post.comments_count}
            profilePic={user?.profile.profile_picture}
          />
        </div>
      ))}
    </div>
  );
}

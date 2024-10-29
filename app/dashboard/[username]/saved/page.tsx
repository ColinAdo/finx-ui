"use client";

import { PostsGrid } from "@/components/post";
import { useGetBookmarkedPostsQuery } from "@/redux/features/postSlice";

interface Props {
  params: {
    username: string;
  };
}

export default function SavedPosts({ params: { username } }: Props) {
  const { data: posts } = useGetBookmarkedPostsQuery(username);

  if (!posts) {
    return;
  }

  return <PostsGrid posts={posts} />;
}

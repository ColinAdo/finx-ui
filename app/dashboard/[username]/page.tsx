"use client";

import { PostsGrid } from "@/components/post";
import { useGetUserPostQuery } from "@/redux/features/postSlice";

interface Props {
  params: {
    username: string;
  };
}

export default function Page({ params: { username } }: Props) {
  const { data: posts } = useGetUserPostQuery(username);

  if (!posts) {
    return;
  }

  return <PostsGrid posts={posts} />;
}

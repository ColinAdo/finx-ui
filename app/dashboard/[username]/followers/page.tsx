"use client";

import { FollowersModal } from "@/components/profile";
import { useRetrieveUsersProfileQuery } from "@/redux/features/profileSlice";

interface Props {
  params: {
    username: string;
  };
}

export default function Page({ params: { username } }: Props) {
  const { data } = useRetrieveUsersProfileQuery(username);

  const followers = data?.following;
  if (!data) {
    return;
  }

  return <FollowersModal followers={followers} username={username} />;
}

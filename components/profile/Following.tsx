"use client";

import Link from "next/link";
import FollowButton from "./FollowButton";
import { UserAvatar } from "@/components/common";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useRetrieveUsersProfileQuery } from "@/redux/features/profileSlice";

interface ProfileData {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
}

interface Props {
  username: string;
  usernameParam: string;
  profileId: number;
  profileData: ProfileData;
}

export default function Following({
  username,
  usernameParam,
  profileId,
  profileData,
}: Props) {
  const { data: user } = useRetrieveUserQuery();

  if (!user) return null;
  const { data: profile } = useRetrieveUsersProfileQuery(username);

  const isFollowing = profile?.followers.some(
    (following) => following.user.id === user.id
  );

  const isCurrentUser = profile?.profile.id === user.id;

  if (!profile) return null;

  return (
    <div className="p-4 flex items-center justify-between gap-x-3">
      <Link
        href={`/dashboard/${usernameParam}`}
        className="flex items-center gap-x-3"
      >
        <UserAvatar user={profileData} className="h-10 w-10" />
        <p className="font-bold text-sm">{usernameParam}</p>
      </Link>
      {isCurrentUser && (
        <FollowButton
          username={username}
          profileId={profileId}
          isFollowing={isFollowing}
          buttonClassName={
            isFollowing ? "bg-neutral-700 dark:hover:bg-neutral-700/40" : ""
          }
        />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { MoreHorizontal, Settings } from "lucide-react";
import { useRetrieveUsersProfileQuery } from "@/redux/features/profileSlice";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { useCreateConversationMutation } from "@/redux/features/chatSlice";
import { UserAvatar } from "@/components/common";
import { ProfileTabs } from "@/components/profile";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FollowButton,
  ProfileAvatar,
  ProfileHeader,
} from "@/components/profile";

type Props = {
  params: {
    username: string;
  };
  children: React.ReactNode;
};

export default function ProfileLayout({
  children,
  params: { username },
}: Props) {
  const { data: profile } = useRetrieveUsersProfileQuery(username);
  const { data } = useRetrieveUserQuery();
  const [conversation] = useCreateConversationMutation();
  const isCurrentUser = profile?.profile.id === data?.id;
  const profileData = useAppSelector((state) => state.auth.profilePicture);
  const router = useRouter();

  const isFollowing = profile?.following.some(
    (user) => user.user.id === data?.id
  );

  if (!profile || !data) {
    return;
  }

  const users: any[] = [];
  const handleCreateConversation = async () => {
    const users = [profile.profile.id, data.id];

    try {
      const response = await conversation({ users }).unwrap();
      const conversationId = response.id;
      router.push(`/dashboard/messages/${conversationId}`);
    } catch (error) {
      toast.error("Error starting conversation");
      console.log("Error:", error);
    }
  };

  return (
    <>
      <ProfileHeader username={profile.profile.username} />
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-x-5 md:gap-x-10 px-4">
          <ProfileAvatar profile={profile}>
            <UserAvatar
              user={profileData ? profileData : profile.profile}
              className="w-20 h-20 md:w-36 md:h-36 cursor-pointer"
            />
          </ProfileAvatar>

          <div className="md:px-10 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-3">
              <p className="font-semibold text-xl">
                {profile.profile.username}
              </p>
              {isCurrentUser ? (
                <>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="md:order-last"
                  >
                    <Settings />
                  </Button>
                  <Link
                    href={`/dashboard/edit-profile`}
                    className={buttonVariants({
                      className: "!font-bold",
                      variant: "secondary",
                      size: "sm",
                    })}
                  >
                    Edit profile
                  </Link>
                  <Button
                    variant={"secondary"}
                    className="font-bold"
                    size={"sm"}
                  >
                    View archive
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className="md:order-last"
                  >
                    <MoreHorizontal />
                  </Button>
                  <FollowButton
                    isFollowing={isFollowing}
                    profileId={profile.profile.id}
                    username={profile.profile.username}
                  />
                  <Button
                    variant={"secondary"}
                    className="font-bold"
                    size={"sm"}
                    onClick={handleCreateConversation}
                  >
                    Message
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-x-7">
              <p className="font-medium">
                <strong>{profile.posts.length} posts</strong>
              </p>

              <Link
                href={`/dashboard/${profile.profile.username}/followers`}
                className="font-medium"
              >
                <strong>{profile.following_count}</strong>{" "}
                {profile.following_count < 1 || profile.following_count > 1
                  ? "followers"
                  : "follower"}
              </Link>

              <Link
                href={`/dashboard/${profile.profile.username}/following`}
                className="font-medium"
              >
                <strong>{profile.followers_count}</strong> following
              </Link>
            </div>

            <div className="text-sm">
              {profile.profile.bio && <p>{profile.profile.bio}</p>}
            </div>
          </div>
        </div>

        <ProfileTabs profile={profile} isCurrentUser={isCurrentUser} />

        {children}
      </div>
    </>
  );
}

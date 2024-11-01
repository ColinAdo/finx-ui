"use client";

import { SubmitButton } from "@/components/post";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FormEvent } from "react";
import { toast } from "sonner";
import {
  useFollowProfileMutation,
  useRetrieveUsersProfileQuery,
} from "@/redux/features/profileSlice";

interface Props {
  profileId: number;
  username: string;
  isFollowing?: boolean;
  className?: string;
  buttonClassName?: string;
}

export default function FollowButton({
  profileId,
  username,
  isFollowing,
  className,
  buttonClassName,
}: Props) {
  const [followProfile] = useFollowProfileMutation();
  const { refetch } = useRetrieveUsersProfileQuery(username);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await followProfile(profileId).unwrap();
      refetch();
    } catch (err) {
      toast.error("failed to follow user!");
    }
  };
  return (
    <form onSubmit={handleSubmit} className={className}>
      <SubmitButton
        className={buttonVariants({
          variant: isFollowing ? "secondary" : "default",
          className: cn("!font-bold w-full mx-1", buttonClassName),
          size: "sm",
        })}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </SubmitButton>
    </form>
  );
}

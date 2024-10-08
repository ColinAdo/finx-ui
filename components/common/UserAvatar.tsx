import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/common";
import Image from "next/image";
import { AvatarProps } from "@radix-ui/react-avatar";

interface ProfileData {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
}

type Props = Partial<AvatarProps> & {
  user: ProfileData;
};

export default function UserAvatar({ user, ...avatarProps }: Props) {
  if (!user) {
    return;
  }

  return (
    <Avatar className="relative h-6 w-6 cursor-pointer" {...avatarProps}>
      {user.profile_picture ? (
        <Image
          src={user.profile_picture}
          fill
          alt={`${user.username}'s avatar`}
          className="rounded-full object-cover"
        />
      ) : (
        <Spinner sm />
      )}
    </Avatar>
  );
}

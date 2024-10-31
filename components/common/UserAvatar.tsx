import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/common";
import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "@/lib/exports";
import Image from "next/image";

type Props = Partial<AvatarProps> & {
  user: User;
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

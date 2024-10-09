import { UserAvatar } from "../common";

interface ProfileData {
  profile: {
    id: number;
    email: string;
    username: string;
    bio: string;
    profile_picture: string;
    website: string;
    gender: string;
  };
  following: any[];
  followers: any[];
  posts: any[];
  following_count: number;
  followers_count: number;
}

interface Props {
  recipientProfile: ProfileData;
}

export default function Messages({ recipientProfile }: Props) {
  return (
    <div className="flex justify-start items-center my-24">
      <UserAvatar
        user={recipientProfile.profile}
        className="h-60 w-60 hidden lg:block"
      />
    </div>
  );
}

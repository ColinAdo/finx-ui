import { UserAvatar } from "../common";
import { useAppSelector } from "@/redux/hooks";

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
  const profileData = useAppSelector((state) => state.auth.profilePicture);
  return (
    <div className="flex justify-start items-center my-24">
      <UserAvatar
        user={profileData ? profileData : recipientProfile.profile}
        className="h-60 w-60 hidden lg:block"
      />
    </div>
  );
}

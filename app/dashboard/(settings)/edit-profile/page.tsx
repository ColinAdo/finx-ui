"use client";

import { ProfileForm } from "@/components/profile";
import { useRetrieveProfileQuery } from "@/redux/features/profileSlice";

export default function Page() {
  const { data: profile } = useRetrieveProfileQuery();

  if (!profile) {
    return;
  }

  return (
    <div className="px-12">
      <h1 className="text-2xl font-medium lg:mx-14">Edit profile</h1>

      <ProfileForm profile={profile} />
    </div>
  );
}

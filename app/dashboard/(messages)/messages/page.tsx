"use client";

import { useRetrieveProfileQuery } from "@/redux/features/profileSlice";
import { Messages } from "@/components/profile";

export default function EditProfile() {
  const { data: profile } = useRetrieveProfileQuery();

  if (!profile) {
    return;
  }

  return (
    <div className="px-12 h-screen lg:w-full">
      <Messages recipientProfile={profile} />
    </div>
  );
}

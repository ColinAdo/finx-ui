"use client";

import { useRetrieveProfileQuery } from "@/redux/features/profileSlice";
import { Chats } from "@/components/profile";

export default function Page() {
  const { data: profile } = useRetrieveProfileQuery();

  if (!profile) {
    return;
  }

  return (
    <div className="px-12 h-screen lg:w-full">
      <Chats recipientProfile={profile} />
    </div>
  );
}

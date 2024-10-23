"use client";

import { useRetrieveConversationQuery } from "@/redux/features/chatSlice";
import { Messages } from "@/components/profile";
import {
  useRetrieveProfileQuery,
  useRetrieveUsersProfileQuery,
} from "@/redux/features/profileSlice";

interface Props {
  params: {
    id: string;
  };
}

export default function Page({ params }: Props) {
  const { data: profile } = useRetrieveProfileQuery();
  const { data: conversation } = useRetrieveConversationQuery(params.id);

  const otherUser: any = conversation?.conversation.users.find(
    (user) => user.id !== profile?.profile.id
  );

  const { data: userProfile } = useRetrieveUsersProfileQuery(
    otherUser?.username
  );

  if (!userProfile) {
    return;
  }

  return (
    <div className="px-12 h-screen lg:w-full">
      <Messages recipientProfile={userProfile} />
    </div>
  );
}

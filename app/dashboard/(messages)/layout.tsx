"use client";

import { UserAvatar } from "@/components/common";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRetrieveProfileQuery } from "@/redux/features/profileSlice";
import { useGetConversationsQuery } from "@/redux/features/chatSlice";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: profile } = useRetrieveProfileQuery();
  const { data: conversations } = useGetConversationsQuery();

  if (!profile || !conversations) {
    return;
  }
  return (
    <div className="flex">
      <Tabs
        defaultValue="edit-profile"
        className="w-[250px] min-h-screen hidden lg:block fixed space-y-8 left-0 top-0 md:ml-20 lg:ml-64 h-full flex-col lg:border-r px-6 py-10"
        orientation="vertical"
      >
        <div className="flex justify-between mx-4 -mt-6">
          <UserAvatar
            user={profile.profile}
            className="h-10 w-10 hidden lg:block"
          />
          <h4 className="font-extrabold text-xl text-white ml-1">Chats</h4>
        </div>
        <TabsList className="flex flex-col items-start justify-start h-full bg-transparent">
          {conversations.map((conversation) => {
            const otherUser = conversation.users.find(
              (user) => user.id !== profile.profile.id
            );

            return (
              <TabsTrigger
                key={conversation.id}
                value={conversation.id}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "lg" }),
                  "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-neutral-800 dark:hover:bg-neutral-900 w-full justify-start !px-3"
                )}
              >
                {otherUser ? (
                  <Link href={`/dashboard/inbox/${conversation.id}`}>
                    {otherUser.username}
                  </Link>
                ) : (
                  "No other user"
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="flex-1 xl:ml-32 min-h-screen bg-white dark:bg-neutral-950">
        {children}
      </div>
    </div>
  );
}

"use client";

import { UserAvatar } from "@/components/common";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRetrieveProfileQuery } from "@/redux/features/profileSlice";
import { cn } from "@/lib/utils";
import Link from "next/link";

const tabs = [
  { title: "Colin", value: "edit-profile", href: `messages` },
  {
    title: "Professional account",
    value: "professional-account",
    href: "/",
  },
  { title: "Notifications", value: "notifications", href: "/" },
  {
    title: "Privacy and security",
    value: "privacy-and-security",
    href: "/",
  },
  { title: "Login activity", value: "login-activity", href: "/" },
  {
    title: "Emails from Instagram",
    value: "emails-from-instagram",
    href: "/",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: profile } = useRetrieveProfileQuery();

  if (!profile) {
    return;
  }
  return (
    <div className="flex">
      <Tabs
        defaultValue="edit-profile"
        className="w-full lg:w-[250px] min-h-screen -mt-4 lg:-mt-2 md:mt-10 h-full flex-col lg:border-r py-10"
        orientation="vertical"
      >
        <div className="flex fixed justify-between mx-4 lg:-ml-8 ml-12 lg:-mt-14 -mt-20">
          <UserAvatar user={profile.profile} className="h-10 w-10" />
          <h4 className="font-extrabold text-xl text-white ml-5">Chats</h4>
        </div>
        <TabsList className="flex flex-col items-start lg:-ml-12  ml-8 justify-start h-full bg-transparent">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-neutral-800 dark:hover:bg-neutral-900 w-full justify-start !px-3"
              )}
            >
              <Link href={`${tab.href}`}>{tab.title}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex-1 xl:ml-32 min-h-screen bg-white dark:bg-neutral-950">
        {children}
      </div>
    </div>
  );
}

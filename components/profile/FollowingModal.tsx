"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMount } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Following } from "@/components/profile";
import { Following as Followings } from "@/lib/exports";

interface Props {
  following: Followings[] | undefined;
  username: string;
}

export default function FollowingModal({ following, username }: Props) {
  const mount = useMount();
  const pathname = usePathname();
  const router = useRouter();
  const isFollowingPage = pathname === `/dashboard/${username}/following`;

  if (!mount) return null;

  console.log("Length of array:", following?.length);

  return (
    <Dialog
      open={isFollowingPage}
      onOpenChange={(isOpen) => !isOpen && router.back()}
    >
      <DialogContent className="dialogContent">
        <DialogHeader className="border-b border-zinc-300 dark:border-neutral-700 py-2 w-full">
          <DialogTitle className="mx-auto font-bold text-base">
            Following
          </DialogTitle>
        </DialogHeader>

        {following?.length === 0 && (
          <p className="p-4 text-sm font-medium">This user follows no one.</p>
        )}

        <ScrollArea className="min-h-fit max-h-[350px]">
          {following?.map((following) =>
            following.follows.username !== username ? (
              <Following
                key={following?.id}
                profileData={following.follows}
                username={username}
                usernameParam={following.follows.username}
                profileId={following.follows.id}
              />
            ) : null
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

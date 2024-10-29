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
import { Follower } from "@/components/profile";
import { Followers } from "@/lib/exports";

interface Props {
  followers: Followers[] | undefined;
  username: string;
}

export default function FollowersModal({ followers, username }: Props) {
  const mount = useMount();
  const pathname = usePathname();
  const router = useRouter();
  const isFollowersPage = pathname === `/dashboard/${username}/followers`;

  if (!mount) return null;

  return (
    <Dialog
      open={isFollowersPage}
      onOpenChange={(isOpen) => !isOpen && router.back()}
    >
      <DialogContent className="dialogContent">
        <DialogHeader className="border-b border-zinc-300 dark:border-neutral-700 py-2 w-full">
          <DialogTitle className="mx-auto font-bold text-base">
            Followers
          </DialogTitle>
        </DialogHeader>

        {followers?.length === 0 && (
          <p className="p-4 text-sm font-medium">This user has no followers.</p>
        )}

        <ScrollArea className="min-h-fit max-h-[350px]">
          {followers?.map((follower) =>
            follower.user.username !== username ? (
              <Follower
                key={follower?.id}
                profileData={follower.user}
                username={username}
                usernameParam={follower.user.username}
                profileId={follower.user.id}
              />
            ) : null
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

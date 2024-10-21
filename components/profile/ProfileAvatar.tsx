"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateProfileMutation } from "@/redux/features/profileSlice";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner, UserAvatar } from "@/components/common";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import { CameraIcon } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { useAppDispatch } from "@/redux/hooks";
import { updateProfilePicture } from "@/redux/features/authSlice";
import { useWebSocket } from "@/hooks";

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

interface ProfilerProps {
  profile: ProfileData;
  children: React.ReactNode;
}

export default function ProfileAvatar({ children, profile }: ProfilerProps) {
  const dispatch = useAppDispatch();
  const [updateProfile] = useUpdateProfileMutation();
  const { data } = useRetrieveUserQuery();
  const isCurrentUser = data?.id === profile?.profile.id;

  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState(
    profile?.profile.profile_picture || " "
  );
  const [isUploading, setIsUploading] = useState(false);
  const { edgestore } = useEdgeStore();

  // New WebSocket connection using react-use-websocket
  const { sendMessage, lastMessage, readyState } = useWebSocket();

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        if (data.type === "profile_picture_updated") {
          setFileUrl(data.profile_picture);
          dispatch(updateProfilePicture(data.profile_picture));
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    } else {
      console.log("No WebSocket message received yet.");
    }
  }, [lastMessage, dispatch]);

  if (!profile) return null;

  if (!isCurrentUser) {
    return (
      <UserAvatar
        user={profile.profile}
        className="w-20 h-20 md:w-36 md:h-36"
      />
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsUploading(true);

      const res = await edgestore.publicFiles.upload({
        file: selectedFile,
        onProgressChange: setProgress,
      });

      setFileUrl(res.url);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fileUrl || isUploading) {
      toast.error(isUploading ? "Uploading in progress" : "No file uploaded");
      return;
    }

    try {
      await updateProfile({
        ...profile.profile,
        userId: profile.profile.id,
        profile_picture: fileUrl,
      }).unwrap();

      toast.success("Profile picture updated");

      sendMessage(
        JSON.stringify({
          type: "update_profile_picture",
          profile_picture: fileUrl,
        })
      );

      setOpen(false);
      setFile(null);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="dialogContent">
        <DialogHeader>
          <DialogTitle className="mx-auto font-medium text-xl py-5">
            Change Profile Photo
          </DialogTitle>
        </DialogHeader>

        {isCurrentUser && (
          <form onSubmit={handleSubmit}>
            <label>
              <div className="flex flex-col disabled:{progress} justify-center py-2 items-center cursor-pointer text-sky-500">
                <CameraIcon />
              </div>
              <input
                id="profile_picture"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {file && (
              <>
                <div className="h-[6px] max-w-full border rounded overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`mt-4 p-2 flex justify-center items-center ${
                      isUploading ? "opacity-50" : ""
                    }`}
                  >
                    {isUploading ? <Spinner sm /> : "Submit"}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        <DialogClose className="postOption border-0 w-full p-3">
          Cancel
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

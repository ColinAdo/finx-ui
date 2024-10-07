"use client";

import { UserAvatar } from "@/components/common";
import Link from "next/link";
import Timestamp from "./Timestamp";
import CommentOptions from "./CommentOptions";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";

interface ProfileData {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
}

interface Comment {
  id: number;
  owner: ProfileData;
  post: number;
  comment: string | null;
  comment_image?: string | null;
  created_at: Date;
}

interface Props {
  comment: Comment;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export default function Comment({ comment, inputRef }: Props) {
  const { data: user } = useRetrieveUserQuery();
  const username = comment.owner.username;
  const href = `/dashboard/${username}`;

  return (
    <div className="group p-3 px-3.5  flex items-start space-x-2.5">
      <Link href={href}>
        <UserAvatar user={comment.owner} />
      </Link>
      <div className="space-y-1.5">
        <div className="flex items-center space-x-1.5 leading-none text-sm">
          <Link href={href} className="font-semibold">
            {username}
          </Link>
          <p className="font-medium">{comment.comment}</p>
        </div>
        <div className="flex h-5 items-center space-x-2.5">
          <Timestamp createdAt={comment.created_at} />
          <button
            className="text-xs font-semibold text-neutral-500"
            onClick={() => inputRef?.current?.focus()}
          >
            Reply
          </button>
          {comment.owner.id === user?.id && (
            <CommentOptions comment={comment} />
          )}
        </div>
      </div>
    </div>
  );
}

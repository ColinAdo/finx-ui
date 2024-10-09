"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CommentSchema } from "@/lib/schemas";
import { ImagePlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEdgeStore } from "@/lib/edgestore";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  useCommentOnPostMutation,
  useGetPostQuery,
} from "@/redux/features/postSlice";
import Image from "next/image";
import { Avatar } from "../ui/avatar";

interface User {
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
  owner: User;
  post: number;
  comment: string | null;
  comment_image?: string | null;
  created_at: Date;
}

interface Props {
  postId: number;
  commentsCount: number;
  comments: Comment[];
  profilePic: string | undefined;
}

export default function Comments({
  postId,
  commentsCount,
  comments,
  profilePic,
}: Props) {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const [comment, setComment] = useState("");
  const [fileUrl, setFileUrl] = useState<{
    url: string;
  }>();
  const [commentOnPost] = useCommentOnPostMutation();
  const { refetch } = useGetPostQuery();
  const { edgestore } = useEdgeStore();

  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: comment,
      comment_image: fileUrl?.url,
    },
  });

  const commenting = form.watch("comment") ?? "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);

      const res = await edgestore.publicFiles.upload({
        file: selectedFile,
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });

      setFileUrl({ url: res.url });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (commenting.trim().length === 0 && !fileUrl) {
      return;
    }

    commentOnPost({
      post: postId,
      comment: form.getValues("comment"),
      comment_image: fileUrl?.url || null,
    })
      .unwrap()
      .then(() => {
        refetch();
        toast.success("Posted successfully");
        form.reset({
          comment: "",
          comment_image: "",
        });
        setFile(null);
        setFileUrl(undefined);
      })
      .catch(() => {
        toast.error("Post failed!");
      });
  };

  return (
    <div className="space-y-0.5 px-3 sm:px-0">
      {commentsCount > 1 && (
        <Link
          scroll={false}
          href={`/dashboard/c/${postId}`}
          className="text-sm font-medium text-neutral-500"
        >
          View all {commentsCount} comments
        </Link>
      )}

      {comments.slice(-1).map((comment, i) => {
        const username = comment.owner.username;

        if (!comment.owner || !comment.comment) {
          return null;
        }

        return (
          <div
            key={i}
            className="text-sm flex items-center space-x-2 font-medium"
          >
            <Link href={`/dashboard/${username}`} className="font-semibold">
              {username}
            </Link>
            <p>{comment.comment}</p>
          </div>
        );
      })}

      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className="border-b border-gray-300 dark:border-neutral-800 pb-3 py-1 flex items-center space-x-2"
        >
          <Avatar className="relative h-4 w-4 cursor-pointer">
            {profilePic ? (
              <Image
                src={`${profilePic}`}
                fill
                alt="profilePic"
                className="rounded-full object-cover"
              />
            ) : (
              <Image
                src="/default.png"
                fill
                alt="profilePic"
                className="rounded-full object-cover"
              />
            )}
          </Avatar>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="bg-transparent rounded-sm text-sm border-none focus:ring-0 focus:outline-none flex-1 placeholder-neutral-500 dark:text-white dark:placeholder-neutral-400 font-medium"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="comment_image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <label>
                      <div className="ml-auto cursor-pointer text-sky-500">
                        <ImagePlus />
                      </div>
                      <input
                        id="comment_image"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <input type="hidden" name="post" value={postId} />

            {(commenting.trim().length > 0 || file) && (
              <button
                type="submit"
                className="text-sky-500 text-sm font-semibold hover:text-sky-300 disabled:hover:text-sky-500 disabled:cursor-not-allowed"
              >
                Post
              </button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

"use client";

import { CommentSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormEvent, useState } from "react";
import {
  useCommentOnPostMutation,
  useRetrievePostQuery,
} from "@/redux/features/postSlice";
import { useEdgeStore } from "@/lib/edgestore";
import { toast } from "sonner";
import { Avatar } from "../ui/avatar";
import Image from "next/image";
import { useMount } from "@/hooks";

interface Props {
  postId: number;
  profilePic: string | undefined;
  className?: string;
}

export default function Comments({ postId, profilePic, className }: Props) {
  const [, setProgress] = useState(0);
  const [comment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<{
    url: string;
  }>();
  const [commentOnPost] = useCommentOnPostMutation();
  const { refetch } = useRetrievePostQuery(postId);
  const mount = useMount();
  const { edgestore } = useEdgeStore();

  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: comment,
      comment_image: fileUrl?.url,
    },
  });
  if (!mount) return null;

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
    <div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit}
          className={cn(
            "border-b relative border-gray-200 dark:border-neutral-800 py-3 flex items-center space-x-2 w-full px-3",
            className
          )}
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
              <FormItem className="w-full flex">
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
              render={() => (
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
                className="text-sky-500 text-sm font-semibold hover:text-sky-700 dark:hover:text-white disabled:cursor-not-allowed  dark:disabled:text-slate-500 disabled:text-sky-500/40 disabled:hover:text-sky-500/40 dark:disabled:hover:text-slate-500"
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

"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, FormEvent } from "react";
import { useMount } from "@/hooks";
import { Input } from "@/components/ui/input";
import { CreatePost } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useEdgeStore } from "@/lib/edgestore";
import { FormButton } from "@/components/common";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useCreatePostMutation,
  useGetPostQuery,
} from "@/redux/features/postSlice";

export default function CreatePostForm() {
  const [createPost] = useCreatePostMutation();
  const { refetch } = useGetPostQuery();

  const router = useRouter();
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [fileUrl, setfileUrl] = useState<{
    url: string;
  }>();
  const { edgestore } = useEdgeStore();

  const mount = useMount();
  const form = useForm<z.infer<typeof CreatePost>>({
    resolver: zodResolver(CreatePost),
    defaultValues: {
      fileUrl: fileUrl?.url,
      caption: caption,
    },
  });

  if (!mount) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createPost({
      fileUrl: fileUrl?.url,
      caption: caption,
    })
      .unwrap()
      .then(() => {
        refetch();
        router.push("/dashboard");
        toast.success("Posted successfully");
      })
      .catch(() => {
        toast.error("Post failed!");
      });
  };

  const handleClick = async () => {
    if (file) {
      try {
        const res = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            setProgress(progress);
          },
        });
        setfileUrl({ url: res.url });
      } catch (error) {
        toast.error("File upload failed");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fileUrl ? (
          <div className="h-80 md:h-[400px] overflow-hidden rounded-md">
            <AspectRatio ratio={1 / 1} className="relative h-full">
              {fileUrl?.url.endsWith(".mp4") ? (
                <video
                  controls
                  className="rounded-md object-cover"
                  width="100%"
                  height="auto"
                >
                  <source src={fileUrl?.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={fileUrl?.url}
                  alt="Post preview"
                  fill
                  className="rounded-md object-cover"
                />
              )}
            </AspectRatio>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="fileUrl"
            render={() => (
              <FormItem>
                <FormControl>
                  <>
                    <label
                      htmlFor="fileUrl"
                      className="flex justify-center cursor-pointer max-w-full p-3"
                    >
                      <div className="flex flex-col justify-center items-center dark:text-gray-200 text-gray-900">
                        <CameraIcon />
                        <span>{fileName ? fileName : "No file selected"}</span>
                      </div>

                      <input
                        id="fileUrl"
                        type="file"
                        className="hidden"
                        value={fileUrl}
                        onChange={handleFileChange}
                      />
                    </label>
                    {fileName ? (
                      <div className="h-[6px] max-w-full border rounded overflow-hidden">
                        <div
                          className="h-full bg-green-500 bg-s transition-all duration-150"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {!!fileUrl && (
          <FormField
            control={form.control}
            name="caption"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="caption">Caption</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id="caption"
                    value={caption}
                    placeholder="Write a caption..."
                    onChange={(e) => {
                      setCaption(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between">
          <FormButton
            btnType="button"
            disabled={!!fileUrl || !fileName}
            onClick={handleClick}
          >
            Next
          </FormButton>
          <FormButton btnType="submit" disabled={!fileUrl}>
            Post
          </FormButton>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ProfileAvatar } from "@/components/profile";
import { Spinner, UserAvatar } from "@/components/common";
import { FormEvent } from "react";
import { UserSchema } from "@/lib/schemas";
import {
  useRetrieveProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/features/profileSlice";

interface ProfileData {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
}

interface Props {
  profile: ProfileData;
}

export default function ProfileForm({ profile }: Props) {
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { refetch } = useRetrieveProfileQuery();
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      profile_picture: profile.profile_picture || "",
      bio: profile.bio || "",
      email: profile.email || "",
      username: profile.username || "",
      website: profile.website || "",
      gender: profile.gender || "",
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = form.getValues();

    try {
      await updateProfile({
        userId: profile.id,
        email: values.email,
        username: values.username,
        profile_picture: values.profile_picture,
        bio: values.bio,
        website: values.website,
        gender: values.gender,
      }).unwrap();

      toast.success("Profile updated successfully");
      refetch();
    } catch (err) {
      toast.error("Profile update failed!");
    }
  };

  return (
    <div className="space-y-8 py-10 lg:p-10 max-w-xl">
      <div className="flex items-center gap-x-2 md:gap-x-5">
        <ProfileAvatar profile={profile}>
          <div className="md:w-20 flex md:justify-end">
            <UserAvatar user={profile} className="w-11 h-11 cursor-pointer" />
          </div>
        </ProfileAvatar>
        <div>
          <p className="font-medium">{profile.username}</p>
          <ProfileAvatar profile={profile}>
            <p className="text-blue-500 text-sm font-bold cursor-pointer hover:text-white">
              Change profile photo
            </p>
          </ProfileAvatar>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <FormField
            disabled
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                  <FormLabel className="font-bold w-20 md:text-right">
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="github" {...field} />
                  </FormControl>
                </div>
                <FormDescription className="md:ml-24 text-xs">
                  Editing your links is only available on mobile. Visit the
                  Instagram app and edit your profile to change the websites in
                  your bio.
                </FormDescription>
                <FormMessage className="md:ml-24" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                  <FormLabel className="font-bold w-20 md:text-right">
                    Bio
                  </FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                </div>
                <FormDescription className="md:ml-24 text-xs">
                  {field.value?.length} / 150
                </FormDescription>
                <FormMessage className="md:ml-24" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col md:flex-row md:items-center gap-y-2 gap-x-8">
                  <FormLabel className="font-bold w-20 md:text-right">
                    Gender
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Prefer not to say" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="prefer-not-to-say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <FormDescription className="md:ml-24 text-xs">
                  This wont be part of your public profile.
                </FormDescription>
                <FormMessage className="md:ml-24" />
              </FormItem>
            )}
          />

          <Button type="submit" className="md:ml-24" disabled={isLoading}>
            {isLoading ? <Spinner sm /> : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

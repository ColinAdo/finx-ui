import type { Metadata } from "next";
import { PasswordResetConfirmForm } from "@/components/forms";
import { View } from "lucide-react";

export const metadata: Metadata = {
  title: "Finx | Reset password confirm",
  description: "Finx request reset password confirm page",
};

interface Props {
  params: {
    uid: string;
    token: string;
  };
}

export default function Page({ params: { uid, token } }: Props) {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <View className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-gray-100 text-gray-900">
          Reset passsword
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <PasswordResetConfirmForm uid={uid} token={token} />
      </div>
    </div>
  );
}

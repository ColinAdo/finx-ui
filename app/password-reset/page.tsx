import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/forms";
import { View } from "lucide-react";

export const metadata: Metadata = {
  title: "Finx | Reset password",
  description: "Finx request reset password page",
};

export default function Page() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <View className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-gray-100 text-gray-900">
          Request password reset
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <PasswordResetForm />
      </div>
    </div>
  );
}

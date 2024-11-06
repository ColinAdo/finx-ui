import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms";
import { SocialButtons } from "@/components/common";
import { View } from "lucide-react";

export const metadata: Metadata = {
  title: "Finx | Register",
  description: "Finx register page",
};

export default function Page() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <View className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-gray-100 text-gray-900">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <RegisterForm />
        <div className="relative flex items-center my-3 font-bold">
          <span className="flex-grow border-t border-gray-950 dark:border-gray-300"></span>
          <span className="mx-3">OR</span>
          <span className="flex-grow border-t border-gray-950 dark:border-gray-300"></span>
        </div>
        <SocialButtons />

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

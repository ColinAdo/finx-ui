import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "@/components/forms";
import { SocialButtons } from "@/components/common";
import { calSans } from "@/app/fonts";

export const metadata: Metadata = {
  title: "Finx | Login",
  description: "Finx login page",
};

export default function Page() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
          width={40}
          height={40}
        />

        <h2
          className={` ${calSans.className} mt-10 text-center text-2xl font-bold leading-9 tracking-tight dark:text-gray-100 text-gray-900`}
        >
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
        <div className="relative flex items-center my-3 font-bold">
          <span className="flex-grow border-t border-gray-950 dark:border-gray-300"></span>
          <span className="mx-3">OR</span>
          <span className="flex-grow border-t border-gray-950 dark:border-gray-300"></span>
        </div>
        <SocialButtons />

        <p className="mt-10 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

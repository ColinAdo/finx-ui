"use client";

import { Suspense } from "react";
import { useSocialAuthenticateMutation } from "@/redux/features/authApiSlice";
import { useSocialAuth } from "@/hooks";
import { Spinner } from "@/components/common";

type AuthPageProps = {
  provider: string;
  authenticate: (params: {
    provider: string;
    state: string;
    code: string;
  }) => Promise<unknown>;
};

function AuthPage({ provider, authenticate }: AuthPageProps) {
  useSocialAuth(authenticate, provider);
  return (
    <div className="flex justify-center items-center my-80">
      <Spinner lg />
    </div>
  );
}

export default function Page() {
  const [githubAuthenticate] = useSocialAuthenticateMutation();

  return (
    <Suspense fallback={<Spinner lg />}>
      <AuthPage provider="github" authenticate={githubAuthenticate} />
    </Suspense>
  );
}

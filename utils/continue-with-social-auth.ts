import { toast } from "sonner";

export default async function ContinueWithSocialAuth(
  provider: string,
  redirect: string
) {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_HOST
    }/api/v1/o/${provider}/?redirect_uri=${
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_REDIRECT_URL
        : "http://localhost:3000"
    }/auth/${redirect}`;

    console.error("Social auth URL:", url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();

    if (res.status === 200 && typeof window !== "undefined") {
      window.location.replace(data.authorization_url);
    } else {
      toast.error("Something went wrong");
    }
  } catch (err) {
    toast.error("Something went wrong 2");
    console.error("Social auth error 2:", err);
  }
}

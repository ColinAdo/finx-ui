import { toast } from "react-toastify";

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

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    const data = await res.json();
    console.log("Fetching Data:", data);
    console.log("--------------------------------");
    console.log("Fetching Url:", url);
    if (res.status === 200 && typeof window !== "undefined") {
      window.location.replace(data.authorization_url);
    } else {
      toast.error("Something went wrong 1");
      toast.error("To confirm");
      console.error("Social auth error:", data);
    }
  } catch (err) {
    toast.error("Something went wrong 2");
    toast.error("To confirm 2");
    console.error("Social auth error 2:", err);
  }
}

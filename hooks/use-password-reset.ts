import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { usePasswordRestMutation } from "@/redux/features/authApiSlice";
import { PasswordResetSchema } from "@/lib/schemas";
import { z } from "zod";

export default function usePassowrdReset() {
  const [passwordReset, { isLoading }] = usePasswordRestMutation();

  const [email, setEmail] = useState("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onSubmit = (data: z.infer<typeof PasswordResetSchema>) => {
    passwordReset(data.email)
      .unwrap()
      .then(() => {
        toast.success("Please check your email for a link");
      })
      .catch(() => {
        toast.error("Failed to request reset password!");
      });
  };
  return {
    email,
    isLoading,
    onChange,
    onSubmit,
  };
}

import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { usePasswordRestConfirmMutation } from "@/redux/features/authApiSlice";
import { PasswordResetConfirmSchema } from "@/lib/schemas";
import { z } from "zod";

export default function usePasswordResetConfirm(uid: string, token: string) {
  const router = useRouter();
  const [passwordResetConfirm, { isLoading }] =
    usePasswordRestConfirmMutation();

  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });

  const { new_password, re_new_password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (data: z.infer<typeof PasswordResetConfirmSchema>) => {
    passwordResetConfirm({ ...data, uid, token })
      .unwrap()
      .then(() => {
        toast.success("Password reset successfully");
        router.push("/auth/login");
      })
      .catch(() => {
        toast.error("Failed to reset password!");
      });
  };
  return {
    new_password,
    re_new_password,
    isLoading,
    onChange,
    onSubmit,
  };
}

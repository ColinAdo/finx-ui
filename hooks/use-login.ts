import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/redux/features/authApiSlice";
import { useAppDispatch } from "@/redux/hooks";
import { setAuth } from "@/redux/features/authSlice";
import { LoginSchema } from "@/lib/schemas";
import { z } from "zod";

export default function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    login({ ...data })
      .unwrap()
      .then(() => {
        dispatch(setAuth());
        toast.success("Logged in successfully");
        router.push("/dashboard");
      })
      .catch(() => {
        toast.error("Wrong email or password!");
      });
  };
  return {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  };
}

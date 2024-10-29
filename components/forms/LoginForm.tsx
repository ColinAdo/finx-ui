"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReuseForm } from "@/components/forms";
import { useLogin } from "@/hooks";
import { LoginSchema } from "@/lib/schemas";

export default function RegisterForm() {
  const { email, password, isLoading, onSubmit } = useLogin();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: email,
      password: password,
    },
  });

  const config = [
    {
      control: form.control,
      name: "email",
      formLabel: "Email address",
      placeholder: "Enter your email address",
      type: "email",
    },
    {
      control: form.control,
      name: "password",
      formLabel: "Password",
      placeholder: "Enter your password",
      type: "password",
      link: {
        linkText: "Forgot password",
        linkUrl: "/password-reset",
      },
    },
  ];

  return (
    <ReuseForm
      config={config}
      form={form}
      schema={LoginSchema}
      onSubmit={onSubmit}
      btnText="Submit"
      isLoading={isLoading}
    />
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReuseForm } from "@/components/forms";
import { useRegister } from "@/hooks";
import { RegisterSchema } from "@/lib/schemas";
import { Config } from "@/lib/exports";

export default function RegisterForm() {
  const { username, email, password, re_password, isLoading, onSubmit } =
    useRegister();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: username,
      email: email,
      password: password,
      re_password: re_password,
    },
  });

  const config: Config<typeof RegisterSchema>[] = [
    {
      control: form.control,
      name: "username",
      formLabel: "Username",
      placeholder: "Enter your username",
      type: "text",
    },
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
    },
    {
      control: form.control,
      name: "re_password",
      formLabel: "Confirm password",
      placeholder: "Enter your username",
      type: "password",
    },
  ];

  return (
    <ReuseForm
      config={config}
      form={form}
      schema={RegisterSchema}
      onSubmit={onSubmit}
      btnText="Submit"
      isLoading={isLoading}
    />
  );
}

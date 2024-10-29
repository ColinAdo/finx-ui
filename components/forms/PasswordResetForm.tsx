"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReuseForm } from "@/components/forms";
import { usePassowrdReset } from "@/hooks";
import { PasswordResetSchema } from "@/lib/schemas";
import { Config } from "@/lib/exports";

export default function PasswordResetForm() {
  const { email, isLoading, onSubmit } = usePassowrdReset();
  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      email: email,
    },
  });

  const config: Config<typeof PasswordResetSchema>[] = [
    {
      control: form.control,
      name: "email",
      formLabel: "Email address",
      placeholder: "Enter your email address",
      type: "email",
    },
  ];

  return (
    <ReuseForm
      config={config}
      form={form}
      schema={PasswordResetSchema}
      onSubmit={onSubmit}
      btnText="Request password reset"
      isLoading={isLoading}
    />
  );
}

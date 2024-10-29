"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReuseForm } from "@/components/forms";
import { usePassowrdResetConfirm } from "@/hooks";
import { PasswordResetConfirmSchema } from "@/lib/schemas";
import { Config } from "@/lib/exports";

interface Props {
  uid: string;
  token: string;
}

export default function PasswordResetConfirmForm({ uid, token }: Props) {
  const { new_password, re_new_password, isLoading, onSubmit } =
    usePassowrdResetConfirm(uid, token);

  const form = useForm<z.infer<typeof PasswordResetConfirmSchema>>({
    resolver: zodResolver(PasswordResetConfirmSchema),
    defaultValues: {
      new_password: new_password,
      re_new_password: re_new_password,
    },
  });

  const config: Config<typeof PasswordResetConfirmSchema>[] = [
    {
      control: form.control,
      name: "new_password",
      formLabel: "New password",
      placeholder: "Enter your new password",
      type: "password",
    },
    {
      control: form.control,
      name: "re_new_password",
      formLabel: "Confirm new password",
      placeholder: "Enter your new password",
      type: "password",
    },
  ];

  return (
    <ReuseForm
      config={config}
      form={form}
      schema={PasswordResetConfirmSchema}
      onSubmit={onSubmit}
      btnText="Submit"
      isLoading={isLoading}
    />
  );
}

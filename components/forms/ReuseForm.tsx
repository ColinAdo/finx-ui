import { UseFormReturn } from "react-hook-form";
import { z, ZodType } from "zod";
import { Form } from "@/components/ui/form";
import { ReuseFormFields } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/common";
import { Control, Path } from "react-hook-form";

interface Config<TSchema extends ZodType> {
  control: Control<z.infer<TSchema>>;
  name: Path<z.infer<TSchema>>;
  formLabel: string;
  placeholder: string;
  type?: string;
  link?: {
    linkText: string;
    linkUrl: string;
  };
}

interface Props<TSchema extends ZodType> {
  config: Config<TSchema>[];
  form: UseFormReturn<z.infer<TSchema>>;
  schema: TSchema;
  btnText: string;
  isLoading: boolean;
  onSubmit: (data: z.infer<TSchema>) => void;
}

export default function MyFormComponent<TSchema extends ZodType>({
  config,
  form,
  btnText,
  isLoading,
  onSubmit,
}: Props<TSchema>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {config.map((input) => (
          <ReuseFormFields
            key={input.name}
            name={input.name}
            type={input.type}
            control={input.control}
            formLabel={input.formLabel}
            placeholder={input.placeholder}
            link={input.link}
          />
        ))}

        <Button type="submit" className="w-full">
          {isLoading ? <Spinner sm /> : `${btnText}`}
        </Button>
      </form>
    </Form>
  );
}

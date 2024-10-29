import cn from "classnames";

interface Props {
  provider: "google" | "github";
  children: React.ReactNode;
  [rest: string]: unknown;
}

export default function SocialButton({ children, ...rest }: Props) {
  const className = cn(
    "flex-1 text-light dark:text-white rounded-md px-3 py-2 font-medium hover:bg-neutral-400 hover:text-black border border-black dark:border-amber-100"
  );

  return (
    <button className={className} {...rest}>
      <span className="flex justify-center items-center">{children}</span>
    </button>
  );
}

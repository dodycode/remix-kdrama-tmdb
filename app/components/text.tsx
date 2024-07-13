import { cn } from "~/lib/cn";

type TextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Text({ children, className, ...props }: TextProps) {
  return (
    <p className={cn("font-normal text-default-500", className)} {...props}>
      {children}
    </p>
  );
}

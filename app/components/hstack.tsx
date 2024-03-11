import { cn } from "~/lib/cn";

type HStackProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HStack({ children, className, ...props }: HStackProps) {
  return (
    <div className={cn("flex flex-wrap", className)} {...props}>
      {children}
    </div>
  );
}

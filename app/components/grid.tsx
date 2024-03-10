import { cn } from "~/lib/cn";

type GridProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Grid({ children, className, ...props }: GridProps) {
  return (
    <div className={cn("grid", className)} {...props}>
      {children}
    </div>
  );
}

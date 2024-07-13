import { cn } from "~/lib/cn";

type VStackProps = {
  children: React.ReactNode;
  className?: string;
  refProp?: React.Ref<HTMLDivElement>;
};

export default function VStack({
  children,
  className,
  refProp,
  ...props
}: VStackProps) {
  return (
    <div ref={refProp} className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}

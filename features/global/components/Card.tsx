import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("border-4 border-black bg-white shadow-[6px_6px_0_0_#000] p-6", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
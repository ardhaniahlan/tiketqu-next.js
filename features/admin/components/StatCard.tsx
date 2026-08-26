import { Card } from "@/features/global/components/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  variant?: "default" | "blue";
}

export function StatCard({ title, value, icon, variant = "default" }: StatCardProps) {
  return (
    <Card className={cn(
      "flex flex-col justify-between",
      variant === "blue" && "bg-blue-600 text-white"
    )}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
        {icon && (
          <div className={cn(
            "p-2 border-2 border-black rounded-full shadow-[2px_2px_0_0_#000]",
            variant === "blue" ? "bg-white text-black" : "bg-blue-100"
          )}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-5xl font-black font-mono">{value}</p>
    </Card>
  );
}
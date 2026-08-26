import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 font-bold border-2 border-black transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-[4px_4px_0_0_#000] hover:-translate-y-1",
    secondary: "bg-white text-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1",
    danger: "bg-red-200 text-red-900 shadow-[4px_4px_0_0_#000] hover:-translate-y-1",
    ghost: "border-transparent bg-transparent hover:bg-gray-100",
  };

  return (
    <button className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}
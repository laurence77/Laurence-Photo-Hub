import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'minimal';
}

export const GlassCard = ({ children, className, hover = false, variant = 'default' }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "glass-card p-6 spring-smooth",
        hover && "hover:shadow-2xl hover:-translate-y-1",
        variant === 'elevated' && "shadow-2xl",
        variant === 'minimal' && "backdrop-blur-md bg-white/20 border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
};
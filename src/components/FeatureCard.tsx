import { GlassCard } from "./GlassCard";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <GlassCard hover className="text-center group">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-glass bg-gradient-primary text-primary-foreground group-hover:shadow-glow spring-smooth">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </GlassCard>
  );
};
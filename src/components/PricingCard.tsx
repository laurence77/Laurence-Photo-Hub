import { Button } from "@/components/ui/button";
import { GlassCard } from "./GlassCard";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  comingSoon?: boolean;
}

export const PricingCard = ({ plan, price, period, features, popular = false, comingSoon = false }: PricingCardProps) => {
  return (
    <GlassCard 
      hover 
      className={cn(
        "relative",
        popular && "border-2 border-primary/30 shadow-glow"
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{plan}</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-foreground">{price}</span>
            <span className="text-muted-foreground">/{period}</span>
          </div>
        </div>
        
        <ul className="space-y-3 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          variant={popular ? "hero" : "glass"} 
          size="lg" 
          className="w-full"
          disabled={comingSoon}
        >
          {comingSoon ? "Coming Soon" : "Get Started"}
        </Button>
      </div>
    </GlassCard>
  );
};
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: () => void;
}

export const SelectableCard = ({ 
  title, 
  description, 
  icon, 
  selected, 
  onClick 
}: SelectableCardProps) => {
  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all duration-200 relative",
        "hover:shadow-lg hover:scale-[1.02]",
        selected 
          ? "border-primary border-2 bg-primary/5" 
          : "border-border hover:border-primary/50"
      )}
      onClick={onClick}
    >
      {selected && (
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="w-4 h-4" />
        </div>
      )}
      
      {icon && (
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
      )}
      
      <div className="space-y-2 text-center">
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
};

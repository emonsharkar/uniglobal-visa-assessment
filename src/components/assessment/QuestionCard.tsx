import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface QuestionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export const QuestionCard = ({ title, description, children }: QuestionCardProps) => {
  return (
    <Card className="p-6 md:p-8 space-y-6 shadow-md">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </Card>
  );
};

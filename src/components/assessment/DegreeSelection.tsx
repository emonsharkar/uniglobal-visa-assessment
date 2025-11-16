import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { degreePrograms } from "@/data/countries";

interface DegreeSelectionProps {
  onContinue: (selected: string[]) => void;
}

export const DegreeSelection = ({ onContinue }: DegreeSelectionProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleDegree = (degree: string) => {
    setSelected(prev => 
      prev.includes(degree) 
        ? prev.filter(d => d !== degree)
        : [...prev, degree]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {degreePrograms.map((degree) => (
          <Card
            key={degree}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 relative",
              "hover:shadow-lg hover:scale-[1.02]",
              selected.includes(degree)
                ? "border-primary border-2 bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => toggleDegree(degree)}
          >
            {selected.includes(degree) && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <p className="font-medium text-foreground text-sm">{degree}</p>
            </div>
          </Card>
        ))}
      </div>
      <Button
        className="w-full"
        size="lg"
        disabled={selected.length === 0}
        onClick={() => onContinue(selected)}
      >
        Continue with {selected.length} {selected.length === 1 ? 'Program' : 'Programs'}
      </Button>
    </div>
  );
};

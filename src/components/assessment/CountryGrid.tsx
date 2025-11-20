import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { countries } from "@/data/countries";

interface CountryGridProps {
  selectedStatus?: string;
  onContinue: (selected: string[]) => void;
}

export const CountryGrid = ({ selectedStatus, onContinue }: CountryGridProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  
  // Filter countries based on selected status
  const filteredCountries = selectedStatus 
    ? countries.filter(country => 
        country.eligibleStatus?.includes(selectedStatus)
      )
    : countries;

  const toggleCountry = (code: string) => {
    setSelected(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCountries.map((country) => (
          <Card
            key={country.code}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200 relative",
              "hover:shadow-lg hover:scale-[1.02]",
              selected.includes(country.code)
                ? "border-primary border-2 bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => toggleCountry(country.code)}
          >
            {selected.includes(country.code) && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="w-3 h-3" />
              </div>
            )}
            <div className="text-center space-y-2">
              <div className="text-4xl">{country.flag}</div>
              <p className="text-sm font-medium text-foreground">{country.name}</p>
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
        Continue with {selected.length} {selected.length === 1 ? 'Country' : 'Countries'}
      </Button>
    </div>
  );
};

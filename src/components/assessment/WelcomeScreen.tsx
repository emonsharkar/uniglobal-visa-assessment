import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { GraduationCap } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12 text-center space-y-8 shadow-lg">
        <div className="flex justify-center">
          <Logo className="h-16 md:h-20" />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-4 rounded-full">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome to VISA Ratio Assessment
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Discover your study abroad opportunities with our comprehensive assessment tool. 
            Get personalized recommendations based on your academic profile and preferences.
          </p>
        </div>

        <Button 
          onClick={onStart}
          size="lg"
          className="text-lg px-8 py-6"
        >
          Start Assessment
        </Button>

        <p className="text-sm text-muted-foreground">
          Takes approximately 5-10 minutes to complete
        </p>
      </Card>
    </div>
  );
};

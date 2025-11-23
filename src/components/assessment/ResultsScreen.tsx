import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  XCircle,
  Phone,
  RotateCcw,
  Sparkles,
  Loader2
} from "lucide-react";
import { calculateVisaRatio, VisaStatus } from "@/utils/calculateVisaRatio";
import { AssessmentData } from "@/types/assessment";
import { countries } from "@/data/countries";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ResultsScreenProps {
  data: AssessmentData;
  onTryAgain: () => void;
}

export const ResultsScreen = ({ data, onTryAgain }: ResultsScreenProps) => {
  const [percentage, setPercentage] = useState<number>(-1);
  const [status, setStatus] = useState<VisaStatus>("NEED_CONSULTATION");
  const [message, setMessage] = useState<string>("Analyzing your profile...");
  const [isCalculating, setIsCalculating] = useState(true);

  // Calculate visa ratio using AI and send email when results are displayed
  useEffect(() => {
    const processResults = async () => {
      try {
        setIsCalculating(true);
        
        // Call AI-powered calculation
        const { data: calcResult, error: calcError } = await supabase.functions.invoke('calculate-visa-ratio', {
          body: data,
        });
        
        if (calcError) {
          console.error('Error calculating visa ratio:', calcError);
          // Fallback to simple calculation
          const fallback = calculateVisaRatio(data);
          setPercentage(fallback.percentage);
          setStatus(fallback.status);
          setMessage(fallback.message);
        } else {
          setPercentage(calcResult.percentage);
          setStatus(calcResult.status);
          setMessage(calcResult.message);
        }
        
        // Send email
        const { error: emailError } = await supabase.functions.invoke('send-assessment-email', {
          body: data,
        });
        
        if (emailError) {
          console.error('Error sending email:', emailError);
          toast.error('Failed to send assessment data. Please contact us directly.');
        } else {
          console.log('Assessment email sent successfully');
        }
      } catch (err) {
        console.error('Error processing results:', err);
        // Fallback to simple calculation
        const fallback = calculateVisaRatio(data);
        setPercentage(fallback.percentage);
        setStatus(fallback.status);
        setMessage(fallback.message);
      } finally {
        setIsCalculating(false);
      }
    };

    processResults();
  }, [data]);

  const getStatusIcon = (status: VisaStatus) => {
    switch (status) {
      case "PERFECT":
        return <CheckCircle2 className="w-20 h-20 text-primary" />;
      case "NEED_CONSULTATION":
        return <Sparkles className="w-20 h-20 text-primary" />;
      case "HIGH_DOCUMENTATION":
        return <AlertCircle className="w-20 h-20 text-accent" />;
      case "AT_RISK":
        return <AlertTriangle className="w-20 h-20 text-destructive" />;
      case "NOT_POSSIBLE":
        return <XCircle className="w-20 h-20 text-destructive" />;
    }
  };

  const getStatusColor = (status: VisaStatus) => {
    switch (status) {
      case "PERFECT":
        return "text-primary";
      case "NEED_CONSULTATION":
        return "text-primary";
      case "HIGH_DOCUMENTATION":
        return "text-accent";
      case "AT_RISK":
        return "text-destructive";
      case "NOT_POSSIBLE":
        return "text-destructive";
    }
  };

  const getStatusText = (status: VisaStatus) => {
    return status.replace(/_/g, ' ');
  };

  const selectedCountries = countries.filter(c => 
    data.selectedCountries?.includes(c.code)
  );
  
  const hasOtherCountry = data.selectedCountries?.includes('OTHER');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-3xl w-full p-8 md:p-12 space-y-8 shadow-lg">
        <div className="flex justify-center">
          <Logo className="h-12" />
        </div>

        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-6 rounded-full">
              {isCalculating ? (
                <Loader2 className="w-20 h-20 text-primary animate-spin" />
              ) : (
                getStatusIcon(status)
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              VISA RATIO COUNTER RESULTS
            </h1>
            <h2 className={`text-3xl md:text-4xl font-bold ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </h2>
          </div>

          {percentage >= 0 && (
            <div className="bg-muted p-8 rounded-lg space-y-2">
              <p className="text-6xl md:text-7xl font-bold text-primary">
                {percentage}%
              </p>
              <p className="text-lg text-muted-foreground">
                VISA Success Probability
              </p>
            </div>
          )}

          <p className="text-lg text-foreground max-w-lg mx-auto">
            {message}
          </p>

          {(selectedCountries.length > 0 || hasOtherCountry) && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Selected Countries:
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {selectedCountries.map(country => (
                  <div 
                    key={country.code}
                    className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2"
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <span className="text-sm font-medium">{country.name}</span>
                  </div>
                ))}
                {hasOtherCountry && (
                  <div className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2">
                    <span className="text-2xl">🌍</span>
                    <span className="text-sm font-medium">Other</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {data.selectedDegrees && data.selectedDegrees.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Selected Programs:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {data.selectedDegrees.map(degree => (
                  <span 
                    key={degree}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {degree}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="flex-1 gap-2"
            onClick={() => window.open('https://uniglobal.com.bd/contact-us/', '_blank')}
          >
            <Phone className="w-5 h-5" />
            Contact Us
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="flex-1 gap-2"
            onClick={onTryAgain}
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Our consultants will contact you via {data.communicationPreference || 'your preferred method'} within 24 hours
        </p>
      </Card>
    </div>
  );
};

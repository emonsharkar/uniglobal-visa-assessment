import { useState } from "react";
import { WelcomeScreen } from "@/components/assessment/WelcomeScreen";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { SelectableCard } from "@/components/assessment/SelectableCard";
import { CountryGrid } from "@/components/assessment/CountryGrid";
import { QualificationForm } from "@/components/assessment/QualificationForm";
import { DegreeSelection } from "@/components/assessment/DegreeSelection";
import { ResultsScreen } from "@/components/assessment/ResultsScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { AssessmentData } from "@/types/assessment";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { 
  CheckCircle2, 
  XCircle, 
  CalendarIcon,
  GraduationCap,
  Users,
  MessageSquare,
  Mail,
  Phone,
  FileText,
  Award,
  BookOpen,
  BookCheck,
  FileCheck,
  Globe,
  Brain
} from "lucide-react";

export default function Assessment() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AssessmentData>({
    hasEnglishTest: null,
  });

  const totalSteps = 12;

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  const handleReset = () => {
    setCurrentStep(1);
    setData({ hasEnglishTest: null });
    setStarted(false);
  };

  const renderStep = () => {
    // Step 1: English test question
    if (currentStep === 1) {
      return (
        <QuestionCard 
          title="Did you appear any English Language Proficiency Test?"
          description="Select your answer to proceed"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <SelectableCard
              title="Yes"
              icon={<CheckCircle2 className="w-12 h-12 text-primary" />}
              selected={data.hasEnglishTest === true}
              onClick={() => {
                setData({ ...data, hasEnglishTest: true });
                setCurrentStep(2);
              }}
            />
            <SelectableCard
              title="No"
              icon={<XCircle className="w-12 h-12 text-muted-foreground" />}
              selected={data.hasEnglishTest === false}
              onClick={() => {
                setData({ ...data, hasEnglishTest: false });
                setCurrentStep(2);
              }}
            />
          </div>
        </QuestionCard>
      );
    }

    // Step 2: Branch based on hasEnglishTest
    if (currentStep === 2) {
      if (data.hasEnglishTest) {
        // 2.1.1: Which test?
        return (
          <QuestionCard 
            title="Which English Language Proficiency Test did you appear?"
            description="Select the test you have taken"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'IELTS', icon: <BookOpen className="w-12 h-12 text-primary" /> },
                { name: 'TOEFL', icon: <BookCheck className="w-12 h-12 text-primary" /> },
                { name: 'PTE', icon: <FileCheck className="w-12 h-12 text-primary" /> },
                { name: 'Duolingo', icon: <Globe className="w-12 h-12 text-primary" /> },
                { name: 'GRE', icon: <Brain className="w-12 h-12 text-primary" /> }
              ].map((test) => (
                <SelectableCard
                  key={test.name}
                  title={test.name}
                  icon={test.icon}
                  selected={data.englishTest === test.name}
                  onClick={() => {
                    setData({ ...data, englishTest: test.name as any });
                    setCurrentStep(3);
                  }}
                />
              ))}
            </div>
          </QuestionCard>
        );
      } else {
        // 2.2.1: Will you appear?
        return (
          <QuestionCard 
            title="Will you appear?"
            description="Do you plan to take an English proficiency test?"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <SelectableCard
                title="Yes"
                icon={<CheckCircle2 className="w-12 h-12 text-primary" />}
                selected={data.willAppear === true}
                onClick={() => {
                  setData({ ...data, willAppear: true });
                  setCurrentStep(3);
                }}
              />
              <SelectableCard
                title="No"
                icon={<XCircle className="w-12 h-12 text-muted-foreground" />}
                selected={data.willAppear === false}
                onClick={() => {
                  setData({ ...data, willAppear: false });
                  setCurrentStep(3);
                }}
              />
            </div>
          </QuestionCard>
        );
      }
    }

    // Step 3: Branch continues
    if (currentStep === 3) {
      if (data.hasEnglishTest) {
        // 2.1.2: Your scores - Auto-calculate overall
        const calculateOverallScore = (scores: any) => {
          if (!scores?.speaking || !scores?.listening || !scores?.reading || !scores?.writing) {
            return '';
          }
          const avg = (
            parseFloat(scores.speaking) + 
            parseFloat(scores.listening) + 
            parseFloat(scores.reading) + 
            parseFloat(scores.writing)
          ) / 4;
          
          // Round to nearest 0.5 for IELTS/PTE style scoring
          return (Math.round(avg * 2) / 2).toFixed(1);
        };

        const currentScores = data.scores || {};
        const calculatedOverall = calculateOverallScore(currentScores);

        return (
          <QuestionCard 
            title="Your Test Scores"
            description={`Please enter your ${data.englishTest} scores for each section. Overall score will be calculated automatically.`}
          >
            <div className="space-y-4">
              {['Speaking', 'Listening', 'Reading', 'Writing'].map((section) => (
                <div key={section} className="space-y-2">
                  <Label htmlFor={section.toLowerCase()} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    {section}
                  </Label>
                  <Input
                    id={section.toLowerCase()}
                    type="number"
                    step="0.5"
                    placeholder={`Enter ${section.toLowerCase()} score`}
                    value={currentScores?.[section.toLowerCase() as keyof typeof currentScores] || ''}
                    onChange={(e) => {
                      const newScores = {
                        ...currentScores,
                        [section.toLowerCase()]: e.target.value,
                      };
                      const overall = calculateOverallScore(newScores);
                      setData({
                        ...data,
                        scores: {
                          ...newScores,
                          overall,
                        } as any,
                      });
                    }}
                  />
                </div>
              ))}
              
              <div className="space-y-2 pt-4 border-t">
                <Label className="flex items-center gap-2 font-bold">
                  <Award className="w-4 h-4 text-primary" />
                  Overall Score (Calculated)
                </Label>
                <Input
                  type="text"
                  value={calculatedOverall || 'Enter all scores above'}
                  disabled
                  className="bg-muted font-bold text-lg"
                />
              </div>
              
              <Button 
                className="w-full mt-6" 
                size="lg"
                disabled={!data.scores?.speaking || !data.scores?.listening || !data.scores?.reading || !data.scores?.writing}
                onClick={() => setCurrentStep(4)}
              >
                Continue
              </Button>
            </div>
          </QuestionCard>
        );
      } else if (data.willAppear) {
        // 2.2.1.1: Preferred date
        return (
          <QuestionCard 
            title="Preferred Date to Appear"
            description="When do you plan to take the test?"
          >
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !data.appearDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {data.appearDate ? format(data.appearDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={data.appearDate}
                    onSelect={(date) => setData({ ...data, appearDate: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <Button 
                className="w-full" 
                size="lg"
                disabled={!data.appearDate}
                onClick={() => setCurrentStep(4)}
              >
                Continue
              </Button>
            </div>
          </QuestionCard>
        );
      } else {
        // 2.2.2.2: Do you have MOI?
        return (
          <QuestionCard 
            title="Do you have MOI?"
            description="Medium of Instruction certificate from your university"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <SelectableCard
                title="Yes"
                icon={<FileText className="w-12 h-12 text-primary" />}
                selected={data.hasMOI === true}
                onClick={() => {
                  setData({ ...data, hasMOI: true });
                  setCurrentStep(4);
                }}
              />
              <SelectableCard
                title="No"
                icon={<XCircle className="w-12 h-12 text-muted-foreground" />}
                selected={data.hasMOI === false}
                onClick={() => {
                  setData({ ...data, hasMOI: false });
                  setCurrentStep(4);
                }}
              />
            </div>
          </QuestionCard>
        );
      }
    }

    // Step 4: MOI University name OR Status selection
    if (currentStep === 4) {
      if (!data.hasEnglishTest && !data.willAppear && data.hasMOI) {
        return (
          <QuestionCard 
            title="Name of University"
            description="Which university issued your MOI?"
          >
            <div className="space-y-4">
              <Input
                placeholder="Enter university name"
                value={data.university || ''}
                onChange={(e) => setData({ ...data, university: e.target.value })}
              />
              <Button 
                className="w-full" 
                size="lg"
                disabled={!data.university}
                onClick={() => setCurrentStep(5)}
              >
                Continue
              </Button>
            </div>
          </QuestionCard>
        );
      } else if (data.hasEnglishTest) {
        // 2.1.3: Select status
        return (
          <QuestionCard 
            title="Select Your Status"
            description="Choose the profile that best matches your situation"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SelectableCard
                title="High Academic with High Financial"
                description={
                  <div className="space-y-1">
                    <div className="font-semibold">Academic: 60-70%+</div>
                    <div className="font-semibold">Financial: €12,000 - €20,000+</div>
                  </div>
                }
                icon={<span className="text-3xl">📚💰</span>}
                selected={data.status === 'high-high'}
                onClick={() => {
                  setData({ ...data, status: 'high-high' });
                  setCurrentStep(5);
                }}
              />
              <SelectableCard
                title="High Academic with Low Financial"
                description={
                  <div className="space-y-1">
                    <div className="font-semibold">Academic: 60-70%+</div>
                    <div className="font-semibold">Financial: €2,000 - €6,000</div>
                  </div>
                }
                icon={<span className="text-3xl">📚💵</span>}
                selected={data.status === 'high-low'}
                onClick={() => {
                  setData({ ...data, status: 'high-low' });
                  setCurrentStep(5);
                }}
              />
              <SelectableCard
                title="Average Academic with High Financial"
                description={
                  <div className="space-y-1">
                    <div className="font-semibold">Academic: 50-60%</div>
                    <div className="font-semibold">Financial: €12,000 - €20,000+</div>
                  </div>
                }
                icon={<span className="text-3xl">📊💰</span>}
                selected={data.status === 'avg-high'}
                onClick={() => {
                  setData({ ...data, status: 'avg-high' });
                  setCurrentStep(5);
                }}
              />
              <SelectableCard
                title="Average Academic with Average Financial"
                description={
                  <div className="space-y-1">
                    <div className="font-semibold">Academic: 50-60%</div>
                    <div className="font-semibold">Financial: €6,000 - €12,000</div>
                  </div>
                }
                icon={<span className="text-3xl">📊💵</span>}
                selected={data.status === 'avg-avg'}
                onClick={() => {
                  setData({ ...data, status: 'avg-avg' });
                  setCurrentStep(5);
                }}
              />
              <SelectableCard
                title="Low Academic with High Financial"
                description={
                  <div className="space-y-1">
                    <div className="font-semibold">Academic: 40-50%</div>
                    <div className="font-semibold">Financial: €12,000 - €20,000+</div>
                  </div>
                }
                icon={<span className="text-3xl">📉💰</span>}
                selected={data.status === 'low-high'}
                onClick={() => {
                  setData({ ...data, status: 'low-high' });
                  setCurrentStep(5);
                }}
              />
            </div>
          </QuestionCard>
        );
      } else {
        // Skip status for non-test takers, move to country selection
        setCurrentStep(5);
        return null;
      }
    }

    // Step 5: Country selection
    if (currentStep === 5) {
      return (
        <QuestionCard 
          title="Preferred Countries"
          description="Select the countries you're interested in (you can select multiple)"
        >
          <CountryGrid 
            selectedStatus={data.status}
            onContinue={(countries) => {
              setData({ ...data, selectedCountries: countries });
              setCurrentStep(6);
            }}
          />
        </QuestionCard>
      );
    }

    // Step 6: Personal information
    if (currentStep === 6) {
      return (
        <QuestionCard 
          title="Your Information"
          description="Please provide your contact details"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={data.personalInfo?.name || ''}
                onChange={(e) => {
                  setData({
                    ...data,
                    personalInfo: {
                      ...data.personalInfo,
                      name: e.target.value,
                    } as any,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                value={data.personalInfo?.email || ''}
                onChange={(e) => {
                  setData({
                    ...data,
                    personalInfo: {
                      ...data.personalInfo,
                      email: e.target.value,
                    } as any,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Phone Number
              </Label>
              <PhoneInput
                international
                defaultCountry="BD"
                value={data.personalInfo?.phone || ''}
                onChange={(value) => {
                  setData({
                    ...data,
                    personalInfo: {
                      ...data.personalInfo,
                      phone: value || '',
                    } as any,
                  });
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button 
              className="w-full mt-6" 
              size="lg"
              disabled={!data.personalInfo?.name || !data.personalInfo?.email || !data.personalInfo?.phone}
              onClick={() => setCurrentStep(7)}
            >
              Continue
            </Button>
          </div>
        </QuestionCard>
      );
    }

    // Step 7: Latest qualification
    if (currentStep === 7) {
      return (
        <QuestionCard 
          title="Your Latest Qualification"
          description="Select your highest educational qualification"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { value: 'SSC', label: 'SSC or Equivalent' },
              { value: 'HSC', label: 'HSC or Equivalent' },
              { value: 'Bachelors', label: 'Bachelors or Equivalent' },
              { value: 'Masters', label: 'Masters or Equivalent' },
              { value: 'PhD', label: 'Ph.D. or Equivalent' },
            ].map((qual) => (
              <SelectableCard
                key={qual.value}
                title={qual.label}
                icon={<GraduationCap className="w-10 h-10 text-primary" />}
                selected={data.qualification === qual.value}
                onClick={() => {
                  setData({ ...data, qualification: qual.value as any });
                  setCurrentStep(8);
                }}
              />
            ))}
          </div>
        </QuestionCard>
      );
    }

    // Step 8: Qualification details
    if (currentStep === 8) {
      return (
        <QuestionCard 
          title="Qualification Details"
          description={`Please provide details about your ${data.qualification}`}
        >
          <QualificationForm
            qualification={data.qualification}
            onSubmit={(details) => {
              setData({ ...data, qualificationDetails: details });
              setCurrentStep(9);
            }}
          />
        </QuestionCard>
      );
    }

    // Step 9: Preferred degree
    if (currentStep === 9) {
      return (
        <QuestionCard 
          title="Preferred Degree to be Achieved"
          description="What degree do you want to pursue?"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'Bachelors', icon: '🎓' },
              { value: 'Masters', icon: '📚' },
              { value: 'Doctorate', icon: '🎯' },
              { value: 'Diploma', icon: '📜' },
            ].map((degree) => (
              <SelectableCard
                key={degree.value}
                title={degree.value}
                icon={<span className="text-4xl">{degree.icon}</span>}
                selected={data.preferredDegree === degree.value}
                onClick={() => {
                  setData({ ...data, preferredDegree: degree.value as any });
                  setCurrentStep(10);
                }}
              />
            ))}
          </div>
        </QuestionCard>
      );
    }

    // Step 10: Preferred degree list
    if (currentStep === 10) {
      return (
        <QuestionCard 
          title="Select Degree Programs"
          description="Choose one or more programs you're interested in"
        >
          <DegreeSelection
            onContinue={(degrees) => {
              setData({ ...data, selectedDegrees: degrees });
              setCurrentStep(11);
            }}
          />
        </QuestionCard>
      );
    }

    // Step 11: Dependents
    if (currentStep === 11) {
      return (
        <QuestionCard 
          title="Do you want to take any dependents with you?"
          description="Select who will accompany you"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { value: 0, label: 'No', icon: <XCircle className="w-10 h-10 text-muted-foreground" /> },
              { value: 1, label: 'Yes, Only Spouse', icon: <Users className="w-10 h-10 text-primary" /> },
              { value: 2, label: 'Yes, Spouse and Child(ren)', icon: <Users className="w-10 h-10 text-primary" /> },
              { value: 3, label: 'Yes, my parents (one or both)', icon: <Users className="w-10 h-10 text-primary" /> },
            ].map((option) => (
              <SelectableCard
                key={option.value}
                title={option.label}
                icon={option.icon}
                selected={data.dependents === option.value}
                onClick={() => {
                  setData({ ...data, dependents: option.value as any });
                  setCurrentStep(12);
                }}
              />
            ))}
          </div>
        </QuestionCard>
      );
    }

    // Step 12: Communication preference
    if (currentStep === 12) {
      return (
        <QuestionCard 
          title="Preferred Communication Method"
          description="How would you like us to contact you?"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <SelectableCard
              title="WhatsApp"
              icon={<MessageSquare className="w-10 h-10 text-primary" />}
              selected={data.communicationPreference === 'whatsapp'}
              onClick={() => {
                setData({ ...data, communicationPreference: 'whatsapp' });
                setCurrentStep(13);
              }}
            />
            <SelectableCard
              title="Email"
              icon={<Mail className="w-10 h-10 text-primary" />}
              selected={data.communicationPreference === 'email'}
              onClick={() => {
                setData({ ...data, communicationPreference: 'email' });
                setCurrentStep(13);
              }}
            />
            <SelectableCard
              title="Phone Call"
              icon={<Phone className="w-10 h-10 text-primary" />}
              selected={data.communicationPreference === 'phone'}
              onClick={() => {
                setData({ ...data, communicationPreference: 'phone' });
                setCurrentStep(13);
              }}
            />
          </div>
        </QuestionCard>
      );
    }

    // Step 13: Results
    if (currentStep === 13) {
      return <ResultsScreen data={data} onTryAgain={handleReset} />;
    }

    return null;
  };

  if (currentStep === 13) {
    return renderStep();
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-center mb-8">
          <Logo className="h-12" />
        </div>
        
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        
        {currentStep > 1 && (
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mb-4"
          >
            ← Back
          </Button>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
}

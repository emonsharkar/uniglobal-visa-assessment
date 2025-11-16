import { useState } from "react";
import { WelcomeScreen } from "@/components/assessment/WelcomeScreen";
import { ProgressBar } from "@/components/assessment/ProgressBar";
import { QuestionCard } from "@/components/assessment/QuestionCard";
import { SelectableCard } from "@/components/assessment/SelectableCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { AssessmentData } from "@/types/assessment";
import { 
  CheckCircle2, 
  XCircle, 
  Calendar,
  GraduationCap,
  Users,
  MessageSquare,
  Mail,
  Phone
} from "lucide-react";

export default function Assessment() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AssessmentData>({
    hasEnglishTest: null,
  });

  const totalSteps = 10;

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  const handleYesNo = (value: boolean, field: keyof AssessmentData) => {
    setData({ ...data, [field]: value });
    setCurrentStep(currentStep + 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
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
                onClick={() => handleYesNo(true, 'hasEnglishTest')}
              />
              <SelectableCard
                title="No"
                icon={<XCircle className="w-12 h-12 text-muted-foreground" />}
                selected={data.hasEnglishTest === false}
                onClick={() => handleYesNo(false, 'hasEnglishTest')}
              />
            </div>
          </QuestionCard>
        );

      case 2:
        if (data.hasEnglishTest) {
          return (
            <QuestionCard 
              title="Which English Language Proficiency Test did you appear?"
              description="Select the test you have taken"
            >
              <div className="grid md:grid-cols-3 gap-4">
                {['IELTS', 'TOEFL', 'PTE', 'Duolingo', 'GRE'].map((test) => (
                  <SelectableCard
                    key={test}
                    title={test}
                    selected={data.englishTest === test}
                    onClick={() => {
                      setData({ ...data, englishTest: test as any });
                      setCurrentStep(currentStep + 1);
                    }}
                  />
                ))}
              </div>
            </QuestionCard>
          );
        } else {
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
                  onClick={() => handleYesNo(true, 'willAppear')}
                />
                <SelectableCard
                  title="No"
                  icon={<XCircle className="w-12 h-12 text-muted-foreground" />}
                  selected={data.willAppear === false}
                  onClick={() => handleYesNo(false, 'willAppear')}
                />
              </div>
            </QuestionCard>
          );
        }

      case 3:
        return (
          <QuestionCard 
            title="Your Test Scores"
            description="Please enter your scores for each section"
          >
            <div className="space-y-4">
              {['Overall', 'Speaking', 'Listening', 'Reading', 'Writing'].map((section) => (
                <div key={section} className="space-y-2">
                  <Label htmlFor={section.toLowerCase()}>{section}</Label>
                  <Input
                    id={section.toLowerCase()}
                    type="number"
                    step="0.5"
                    placeholder={`Enter ${section.toLowerCase()} score`}
                    onChange={(e) => {
                      setData({
                        ...data,
                        scores: {
                          ...data.scores,
                          [section.toLowerCase()]: e.target.value,
                        } as any,
                      });
                    }}
                  />
                </div>
              ))}
              <Button 
                className="w-full mt-6" 
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Continue
              </Button>
            </div>
          </QuestionCard>
        );

      case 4:
        return (
          <QuestionCard 
            title="Select Your Status"
            description="Choose the profile that best matches your situation"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SelectableCard
                title="High Academic Profile with High Financial Affordability"
                description="Academic: 60-70%+ | Financial: €12,000-€20,000+"
                selected={data.status === 'high-high'}
                onClick={() => {
                  setData({ ...data, status: 'high-high' });
                  setCurrentStep(currentStep + 1);
                }}
              />
              <SelectableCard
                title="High Academic Profile with Low Financial Affordability"
                description="Academic: 60-70%+ | Financial: €2,000-€6,000"
                selected={data.status === 'high-low'}
                onClick={() => {
                  setData({ ...data, status: 'high-low' });
                  setCurrentStep(currentStep + 1);
                }}
              />
              <SelectableCard
                title="Average Academic Profile with High Financial Affordability"
                description="Academic: 50-60% | Financial: €12,000-€20,000+"
                selected={data.status === 'avg-high'}
                onClick={() => {
                  setData({ ...data, status: 'avg-high' });
                  setCurrentStep(currentStep + 1);
                }}
              />
              <SelectableCard
                title="Average Academic Profile with Average Financial Affordability"
                description="Academic: 50-60% | Financial: €6,000-€12,000"
                selected={data.status === 'avg-avg'}
                onClick={() => {
                  setData({ ...data, status: 'avg-avg' });
                  setCurrentStep(currentStep + 1);
                }}
              />
              <SelectableCard
                title="Low Academic Profile with High Financial Affordability"
                description="Academic: 40-50% | Financial: €12,000-€20,000+"
                selected={data.status === 'low-high'}
                onClick={() => {
                  setData({ ...data, status: 'low-high' });
                  setCurrentStep(currentStep + 1);
                }}
              />
            </div>
          </QuestionCard>
        );

      case 5:
        return (
          <QuestionCard 
            title="Your Information"
            description="Please provide your contact details"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
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
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+880 1XXX XXXXXX"
                  onChange={(e) => {
                    setData({
                      ...data,
                      personalInfo: {
                        ...data.personalInfo,
                        phone: e.target.value,
                      } as any,
                    });
                  }}
                />
              </div>
              <Button 
                className="w-full mt-6" 
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Continue
              </Button>
            </div>
          </QuestionCard>
        );

      case 6:
        return (
          <QuestionCard 
            title="Your Latest Qualification"
            description="Select your highest educational qualification"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    setCurrentStep(currentStep + 1);
                  }}
                />
              ))}
            </div>
          </QuestionCard>
        );

      case 7:
        return (
          <QuestionCard 
            title="Do you want to take any dependents with you?"
            description="Select who will accompany you"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 0, label: 'No', icon: <XCircle className="w-10 h-10" /> },
                { value: 1, label: 'Yes, Only Spouse', icon: <Users className="w-10 h-10" /> },
                { value: 2, label: 'Yes, Spouse and Child(ren)', icon: <Users className="w-10 h-10" /> },
                { value: 3, label: 'Yes, my parents (one or both)', icon: <Users className="w-10 h-10" /> },
              ].map((option) => (
                <SelectableCard
                  key={option.value}
                  title={option.label}
                  icon={option.icon}
                  selected={data.dependents === option.value}
                  onClick={() => {
                    setData({ ...data, dependents: option.value as any });
                    setCurrentStep(currentStep + 1);
                  }}
                />
              ))}
            </div>
          </QuestionCard>
        );

      case 8:
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
                  setCurrentStep(currentStep + 1);
                }}
              />
              <SelectableCard
                title="Email"
                icon={<Mail className="w-10 h-10 text-primary" />}
                selected={data.communicationPreference === 'email'}
                onClick={() => {
                  setData({ ...data, communicationPreference: 'email' });
                  setCurrentStep(currentStep + 1);
                }}
              />
              <SelectableCard
                title="Phone Call"
                icon={<Phone className="w-10 h-10 text-primary" />}
                selected={data.communicationPreference === 'phone'}
                onClick={() => {
                  setData({ ...data, communicationPreference: 'phone' });
                  setCurrentStep(currentStep + 1);
                }}
              />
            </div>
          </QuestionCard>
        );

      default:
        return (
          <QuestionCard 
            title="Assessment Complete!"
            description="Thank you for completing the assessment"
          >
            <div className="text-center space-y-6">
              <div className="bg-primary/10 p-8 rounded-full inline-block">
                <CheckCircle2 className="w-16 h-16 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">
                  YOU'RE PERFECT
                </h3>
                <p className="text-4xl font-bold text-foreground">85%</p>
                <p className="text-muted-foreground mt-2">VISA Success Probability</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="flex-1 sm:flex-initial">
                  Contact Us
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="flex-1 sm:flex-initial"
                  onClick={() => {
                    setCurrentStep(1);
                    setData({ hasEnglishTest: null });
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </QuestionCard>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-center mb-8">
          <Logo className="h-12" />
        </div>
        
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        
        {renderStep()}
      </div>
    </div>
  );
}

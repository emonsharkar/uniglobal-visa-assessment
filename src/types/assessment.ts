export type AssessmentData = {
  hasEnglishTest: boolean | null;
  englishTest?: 'IELTS' | 'TOEFL' | 'PTE' | 'Duolingo' | 'GRE' | null;
  scores?: {
    overall: string;
    speaking: string;
    listening: string;
    reading: string;
    writing: string;
  };
  status?: 'high-high' | 'high-low' | 'avg-high' | 'avg-avg' | 'low-high' | null;
  willAppear?: boolean | null;
  appearDate?: Date | null;
  hasMOI?: boolean | null;
  university?: string;
  selectedCountries?: string[];
  personalInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  qualification?: 'SSC' | 'HSC' | 'Bachelors' | 'Masters' | 'PhD' | null;
  qualificationDetails?: {
    result: string;
    group?: string;
    department?: string;
    university?: string;
    yearOfPassing: string;
  };
  preferredDegree?: 'Bachelors' | 'Masters' | 'Doctorate' | 'Diploma' | null;
  selectedDegrees?: string[];
  dependents?: 0 | 1 | 2 | 3 | null;
  communicationPreference?: 'whatsapp' | 'email' | 'phone' | null;
};

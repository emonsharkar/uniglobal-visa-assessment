import { AssessmentData } from "@/types/assessment";

export type VisaStatus = 
  | "PERFECT" 
  | "NEED_CONSULTATION" 
  | "HIGH_DOCUMENTATION" 
  | "AT_RISK" 
  | "NOT_POSSIBLE";

export const calculateVisaRatio = (data: AssessmentData): { percentage: number; status: VisaStatus; message: string } => {
  let score = 0;
  let maxScore = 0;

  // English Test Score (35 points max) - More weight on actual test scores
  maxScore += 35;
  if (data.hasEnglishTest && data.scores) {
    const overall = parseFloat(data.scores.overall || '0');
    const speaking = parseFloat(data.scores.speaking || '0');
    const listening = parseFloat(data.scores.listening || '0');
    const reading = parseFloat(data.scores.reading || '0');
    const writing = parseFloat(data.scores.writing || '0');
    
    // Score based on overall band
    if (overall >= 8.0) score += 35;
    else if (overall >= 7.5) score += 33;
    else if (overall >= 7.0) score += 30;
    else if (overall >= 6.5) score += 26;
    else if (overall >= 6.0) score += 22;
    else if (overall >= 5.5) score += 17;
    else score += 12;
    
    // Bonus for balanced scores (no module below 6.0)
    if (speaking >= 6.0 && listening >= 6.0 && reading >= 6.0 && writing >= 6.0) {
      score += 2;
    }
  } else if (data.willAppear) {
    score += 12; // Planning to take test
  } else if (data.hasMOI) {
    score += 18; // Medium of Instruction is valuable
  } else {
    score += 5; // Minimal score
  }

  // Academic & Financial Status (30 points max)
  maxScore += 30;
  if (data.status === 'high-high') {
    score += 30;
  } else if (data.status === 'avg-high') {
    score += 27;
  } else if (data.status === 'high-low') {
    score += 24;
  } else if (data.status === 'avg-avg') {
    score += 20;
  } else if (data.status === 'low-high') {
    score += 22;
  } else {
    score += 12;
  }

  // Qualification Level (15 points max)
  maxScore += 15;
  if (data.qualification === 'PhD') {
    score += 15;
  } else if (data.qualification === 'Masters') {
    score += 14;
  } else if (data.qualification === 'Bachelors') {
    score += 12;
  } else if (data.qualification === 'HSC') {
    score += 9;
  } else if (data.qualification === 'SSC') {
    score += 6;
  }

  // Qualification Details (15 points max) - More emphasis on academic performance
  maxScore += 15;
  if (data.qualificationDetails) {
    const result = parseFloat(data.qualificationDetails.result || '0');
    if (['SSC', 'HSC'].includes(data.qualification || '')) {
      // GPA out of 5
      if (result >= 5.0) score += 15;
      else if (result >= 4.5) score += 13;
      else if (result >= 4.0) score += 11;
      else if (result >= 3.5) score += 8;
      else if (result >= 3.0) score += 6;
      else score += 4;
    } else {
      // CGPA out of 4
      if (result >= 3.75) score += 15;
      else if (result >= 3.5) score += 13;
      else if (result >= 3.25) score += 11;
      else if (result >= 3.0) score += 8;
      else if (result >= 2.75) score += 6;
      else score += 4;
    }
  }

  // Dependents (5 points max)
  maxScore += 5;
  if (data.dependents === 0) {
    score += 5;
  } else if (data.dependents === 1) {
    score += 4;
  } else if (data.dependents === 2) {
    score += 2;
  } else {
    score += 1;
  }

  const percentage = Math.round((score / maxScore) * 100);

  let status: VisaStatus;
  let message: string;

  if (percentage >= 80) {
    status = "PERFECT";
    message = "Excellent! Your profile is highly competitive for VISA approval.";
  } else if (percentage >= 65) {
    status = "NEED_CONSULTATION";
    message = "Good profile! Let's discuss how to strengthen your application.";
  } else if (percentage >= 50) {
    status = "HIGH_DOCUMENTATION";
    message = "You'll need comprehensive documentation and guidance.";
  } else if (percentage >= 35) {
    status = "AT_RISK";
    message = "Your application needs significant improvement.";
  } else {
    status = "NOT_POSSIBLE";
    message = "We recommend improving your profile before applying.";
  }

  return { percentage, status, message };
};

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

  // English Test Score (30 points max)
  maxScore += 30;
  if (data.hasEnglishTest && data.scores) {
    const overall = parseFloat(data.scores.overall || '0');
    if (overall >= 7.0) score += 30;
    else if (overall >= 6.5) score += 25;
    else if (overall >= 6.0) score += 20;
    else if (overall >= 5.5) score += 15;
    else score += 10;
  } else if (data.willAppear) {
    score += 15; // Partial credit for planning to take test
  } else if (data.hasMOI) {
    score += 20; // Medium of Instruction acceptable
  } else {
    score += 5; // Minimal score if no English proof
  }

  // Academic & Financial Status (35 points max)
  maxScore += 35;
  if (data.status === 'high-high') {
    score += 35;
  } else if (data.status === 'high-low') {
    score += 28;
  } else if (data.status === 'avg-high') {
    score += 30;
  } else if (data.status === 'avg-avg') {
    score += 22;
  } else if (data.status === 'low-high') {
    score += 25;
  } else {
    score += 15;
  }

  // Qualification Level (20 points max)
  maxScore += 20;
  if (data.qualification === 'PhD') {
    score += 20;
  } else if (data.qualification === 'Masters') {
    score += 18;
  } else if (data.qualification === 'Bachelors') {
    score += 15;
  } else if (data.qualification === 'HSC') {
    score += 12;
  } else if (data.qualification === 'SSC') {
    score += 8;
  }

  // Qualification Details (10 points max)
  maxScore += 10;
  if (data.qualificationDetails) {
    const result = parseFloat(data.qualificationDetails.result || '0');
    if (['SSC', 'HSC'].includes(data.qualification || '')) {
      // GPA out of 5
      if (result >= 4.5) score += 10;
      else if (result >= 4.0) score += 8;
      else if (result >= 3.5) score += 6;
      else score += 4;
    } else {
      // CGPA out of 4
      if (result >= 3.7) score += 10;
      else if (result >= 3.3) score += 8;
      else if (result >= 3.0) score += 6;
      else score += 4;
    }
  }

  // Dependents (5 points max)
  maxScore += 5;
  if (data.dependents === 0) {
    score += 5; // No dependents is easier
  } else if (data.dependents === 1) {
    score += 4;
  } else if (data.dependents === 2) {
    score += 3;
  } else {
    score += 2;
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

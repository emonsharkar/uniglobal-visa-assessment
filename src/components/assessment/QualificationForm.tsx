import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssessmentData } from "@/types/assessment";

interface QualificationFormProps {
  qualification: AssessmentData['qualification'];
  onSubmit: (details: AssessmentData['qualificationDetails']) => void;
}

export const QualificationForm = ({ qualification, onSubmit }: QualificationFormProps) => {
  const [details, setDetails] = useState<AssessmentData['qualificationDetails']>({
    result: '',
    yearOfPassing: '',
  });

  const isSchoolLevel = qualification === 'SSC' || qualification === 'HSC';

  const handleSubmit = () => {
    if (details.result && details.yearOfPassing) {
      onSubmit(details);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="result">
          {isSchoolLevel ? 'Result (GPA out of 5.0)' : 'Result (CGPA out of 4.0)'}
        </Label>
        <Input
          id="result"
          type="number"
          step="0.01"
          max={isSchoolLevel ? "5.00" : "4.00"}
          placeholder={isSchoolLevel ? "e.g., 4.50" : "e.g., 3.75"}
          value={details.result}
          onChange={(e) => setDetails({ ...details, result: e.target.value })}
        />
        {!isSchoolLevel && (
          <p className="text-xs text-muted-foreground">
            <a 
              href="https://ugc.portal.gov.bd/sites/default/files/files/ugc.portal.gov.bd/page/ad5e35a2_65ec_4a35_948a_b4a7a54de7ba/Uniform%20Recommended%20Grading%20System%20%281%29.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Click here
            </a>
            {' '}for CGPA conversion guidelines
          </p>
        )}
      </div>

      {isSchoolLevel ? (
        <div className="space-y-2">
          <Label htmlFor="group">Group</Label>
          <Select 
            value={details.group} 
            onValueChange={(value) => setDetails({ ...details, group: value })}
          >
            <SelectTrigger id="group">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="Commerce">Commerce</SelectItem>
              <SelectItem value="Arts">Arts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              placeholder="e.g., Computer Science & Engineering"
              value={details.department}
              onChange={(e) => setDetails({ ...details, department: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              placeholder="e.g., University of Dhaka"
              value={details.university}
              onChange={(e) => setDetails({ ...details, university: e.target.value })}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="year">Year of Passing</Label>
        <Input
          id="year"
          type="number"
          min="1980"
          max={new Date().getFullYear()}
          placeholder="e.g., 2023"
          value={details.yearOfPassing}
          onChange={(e) => setDetails({ ...details, yearOfPassing: e.target.value })}
        />
        {details.yearOfPassing && (details.yearOfPassing.length !== 4 || parseInt(details.yearOfPassing) < 1980 || parseInt(details.yearOfPassing) > new Date().getFullYear()) && (
          <p className="text-xs text-destructive">Please enter a valid 4-digit year between 1980 and {new Date().getFullYear()}</p>
        )}
      </div>

      <Button 
        className="w-full mt-6" 
        size="lg"
        onClick={handleSubmit}
        disabled={
          !details.result || 
          !details.yearOfPassing || 
          details.yearOfPassing.length !== 4 || 
          parseInt(details.yearOfPassing) < 1980 || 
          parseInt(details.yearOfPassing) > new Date().getFullYear() ||
          (isSchoolLevel && !details.group) || 
          (!isSchoolLevel && !details.department)
        }
      >
        Continue
      </Button>
    </div>
  );
};

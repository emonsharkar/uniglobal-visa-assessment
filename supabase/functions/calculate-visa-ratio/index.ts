import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const assessmentData = await req.json();
    
    // Special case: Has MOI - needs consultation
    if (assessmentData.hasMOI === true) {
      return new Response(
        JSON.stringify({
          percentage: -1,
          status: "NEED_CONSULTATION",
          message: "We will contact you to discuss your Medium of Instruction documentation and guide you through the application process.",
          keyFactors: []
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare comprehensive analysis prompt
    const systemPrompt = `You are an expert visa consultant with deep knowledge of international student visa requirements and success rates. Analyze the provided student assessment data and calculate an accurate visa success probability percentage.

Consider these critical factors in your analysis:
1. Academic qualifications (latest qualification level, CGPA/GPA scores)
2. English proficiency test scores (IELTS, TOEFL, PTE, Duolingo) or MOI
3. Selected countries and their specific visa requirements
4. Work experience and career background
5. Financial capability indicators
6. Overall profile strength

Provide a realistic percentage (0-100) based on historical visa approval patterns and current immigration policies. Be precise and data-driven in your assessment.`;

    const userPrompt = `Please analyze this student visa application profile and provide an accurate success probability percentage:

Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Based on this data, calculate the visa success probability percentage considering:
- Academic strength and consistency
- English proficiency meeting country requirements
- Financial stability indicators
- Work experience relevance
- Country-specific visa policies and approval rates
- Overall profile competitiveness

Return ONLY a JSON object with this exact structure:
{
  "percentage": <number between 0-100>,
  "status": "<one of: PERFECT, NEED_CONSULTATION, HIGH_DOCUMENTATION, AT_RISK, NOT_POSSIBLE>",
  "message": "<detailed explanation of the assessment in 1-2 sentences>",
  "keyFactors": ["factor1", "factor2", "factor3"]
}`;

    // Call Lovable AI for intelligent analysis
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error("No response from AI");
    }

    // Parse AI response - handle potential markdown code blocks
    let result;
    try {
      // Remove markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                       aiContent.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      result = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiContent);
      // Fallback to simple calculation if AI parsing fails
      result = getFallbackCalculation(assessmentData);
    }

    // Validate and ensure proper structure
    const finalResult = {
      percentage: Math.min(100, Math.max(0, result.percentage || 0)),
      status: result.status || "NEED_CONSULTATION",
      message: result.message || "We will contact you to discuss your application.",
      keyFactors: result.keyFactors || []
    };

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in calculate-visa-ratio:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        percentage: 50,
        status: "NEED_CONSULTATION",
        message: "We encountered an issue analyzing your profile. Our consultants will contact you for a detailed assessment."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Fallback calculation if AI fails
function getFallbackCalculation(data: any) {
  let score = 50; // Base score
  
  // Adjust based on English proficiency
  if (data.hasEnglishTest && data.englishTestScore) {
    score += 15;
  } else if (data.hasMOI) {
    score += 10;
  }
  
  // Adjust based on academic performance
  if (data.qualifications?.length > 0) {
    const avgResult = data.qualifications.reduce((sum: number, q: any) => 
      sum + (parseFloat(q.result) || 0), 0) / data.qualifications.length;
    if (avgResult >= 3.5) score += 15;
    else if (avgResult >= 3.0) score += 10;
    else if (avgResult >= 2.5) score += 5;
  }
  
  // Adjust based on work experience
  if (data.workExperience === 'yes') score += 10;
  
  return {
    percentage: Math.min(95, Math.max(20, score)),
    status: score >= 80 ? "PERFECT" : score >= 60 ? "HIGH_DOCUMENTATION" : "NEED_CONSULTATION",
    message: "Based on your profile analysis, we recommend consulting with our team for personalized guidance."
  };
}

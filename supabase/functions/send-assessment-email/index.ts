import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const assessmentData = await req.json();
    
    const client = new SMTPClient({
      connection: {
        hostname: Deno.env.get('SMTP_HOST')!,
        port: parseInt(Deno.env.get('SMTP_PORT')!),
        tls: true,
        auth: {
          username: Deno.env.get('SMTP_USER')!,
          password: Deno.env.get('SMTP_PASSWORD')!,
        },
      },
    });

    // Build email body
    const emailBody = `
      <h2>New VISA Assessment Submission</h2>
      
      <h3>Personal Information</h3>
      <p><strong>Name:</strong> ${assessmentData.personalInfo?.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${assessmentData.personalInfo?.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${assessmentData.personalInfo?.phone || 'N/A'}</p>
      
      <h3>English Test Information</h3>
      <p><strong>Has English Test:</strong> ${assessmentData.hasEnglishTest ? 'Yes' : 'No'}</p>
      ${assessmentData.englishTest ? `<p><strong>Test Type:</strong> ${assessmentData.englishTest}</p>` : ''}
      ${assessmentData.scores ? `
        <p><strong>Overall Score:</strong> ${assessmentData.scores.overall}</p>
        <p><strong>Speaking:</strong> ${assessmentData.scores.speaking}</p>
        <p><strong>Listening:</strong> ${assessmentData.scores.listening}</p>
        <p><strong>Reading:</strong> ${assessmentData.scores.reading}</p>
        <p><strong>Writing:</strong> ${assessmentData.scores.writing}</p>
      ` : ''}
      ${assessmentData.willAppear !== null ? `<p><strong>Will Appear:</strong> ${assessmentData.willAppear ? 'Yes' : 'No'}</p>` : ''}
      ${assessmentData.appearDate ? `<p><strong>Appear Date:</strong> ${new Date(assessmentData.appearDate).toLocaleDateString()}</p>` : ''}
      ${assessmentData.hasMOI !== null ? `<p><strong>Has MOI:</strong> ${assessmentData.hasMOI ? 'Yes' : 'No'}</p>` : ''}
      ${assessmentData.university ? `<p><strong>University:</strong> ${assessmentData.university}</p>` : ''}
      
      <h3>Academic & Financial Status</h3>
      ${assessmentData.status ? `<p><strong>Status:</strong> ${assessmentData.status}</p>` : ''}
      
      <h3>Qualification</h3>
      <p><strong>Level:</strong> ${assessmentData.qualification || 'N/A'}</p>
      ${assessmentData.qualificationDetails ? `
        <p><strong>Result:</strong> ${assessmentData.qualificationDetails.result}</p>
        ${assessmentData.qualificationDetails.group ? `<p><strong>Group:</strong> ${assessmentData.qualificationDetails.group}</p>` : ''}
        ${assessmentData.qualificationDetails.department ? `<p><strong>Department:</strong> ${assessmentData.qualificationDetails.department}</p>` : ''}
        ${assessmentData.qualificationDetails.university ? `<p><strong>University:</strong> ${assessmentData.qualificationDetails.university}</p>` : ''}
        <p><strong>Year of Passing:</strong> ${assessmentData.qualificationDetails.yearOfPassing}</p>
      ` : ''}
      
      <h3>Preferences</h3>
      ${assessmentData.selectedCountries ? `<p><strong>Countries:</strong> ${assessmentData.selectedCountries.join(', ')}</p>` : ''}
      ${assessmentData.preferredDegree ? `<p><strong>Preferred Degree:</strong> ${assessmentData.preferredDegree}</p>` : ''}
      ${assessmentData.selectedDegrees ? `<p><strong>Degree Programs:</strong> ${assessmentData.selectedDegrees.join(', ')}</p>` : ''}
      ${assessmentData.dependents !== null ? `<p><strong>Dependents:</strong> ${assessmentData.dependents}</p>` : ''}
      ${assessmentData.communicationPreference ? `<p><strong>Communication Preference:</strong> ${assessmentData.communicationPreference}</p>` : ''}
    `;

    await client.send({
      from: "info@uniglobal.com.bd",
      to: "emonsharkar.2000@gmail.com",
      subject: `New VISA Assessment - ${assessmentData.personalInfo?.name || 'Unknown'}`,
      content: emailBody,
      html: emailBody,
    });

    await client.close();

    console.log('Assessment email sent successfully');

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error sending assessment email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

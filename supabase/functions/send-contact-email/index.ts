
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email_client, message } = await req.json()

    console.log("Sending contact email:", { name, email_client });

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

    const subject = `New Contact Message from ${name}`
    const html = `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email_client}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Contact Form <onboarding@resend.dev>',
        to: ['kennethjohncayme@gmail.com'],
        subject,
        html,
      }),
    })

    const result = await resendRes.json()

    console.log("Email sent successfully:", result);

    // Handle Resend API rate/usage limits
    if (resendRes.status === 429) {
      return new Response(
        JSON.stringify({ error: 'Too Many Requests' }),
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }

    if (resendRes.status === 400 && result?.message?.includes('monthly limit')) {
      return new Response(
        JSON.stringify({ error: 'Maximum Email Sent per Month Reached' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }

    if (!resendRes.ok) {
      return new Response(
        JSON.stringify({ error: result.message || 'Unknown error' }),
        { 
          status: resendRes.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email sent successfully',
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (err) {
    console.error("Error in send-contact-email function:", err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }
})

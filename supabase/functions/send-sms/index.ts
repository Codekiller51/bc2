import { corsHeaders } from '../_shared/cors.ts'

interface SMSRequest {
  to: string
  message: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { to, message }: SMSRequest = await req.json()

    if (!to || !message) {
      throw new Error('Missing required fields: to, message')
    }

    // Validate Tanzanian phone number format
    const phoneRegex = /^(\+255|0)[67]\d{8}$/
    if (!phoneRegex.test(to)) {
      throw new Error('Invalid Tanzanian phone number format')
    }

    // In a real implementation, you would integrate with:
    // - Twilio
    // - Africa's Talking
    // - Nexmo/Vonage
    // - Local Tanzanian SMS providers
    
    console.log('Sending SMS:', { to, message: message.substring(0, 50) + '...' })
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Simulate 90% success rate
    if (Math.random() > 0.1) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'SMS sent successfully',
          messageId: `sms_${Date.now()}`
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    } else {
      throw new Error('SMS delivery failed')
    }
  } catch (error) {
    console.error('SMS sending error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to send SMS'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})
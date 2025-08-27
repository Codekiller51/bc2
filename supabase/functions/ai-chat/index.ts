import { corsHeaders } from '../_shared/cors.ts'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  messages: ChatMessage[]
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { messages }: RequestBody = await req.json()

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required')
    }

    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY')
    if (!openRouterApiKey) {
      throw new Error('OpenRouter API key not configured')
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://brandconnect.co.tz',
        'X-Title': 'Brand Connect'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for Brand Connect, a platform that connects clients with creative professionals in Tanzania. 
            
            You can help users with:
            - Finding creative professionals (graphic designers, photographers, videographers, digital marketers)
            - Understanding how the platform works
            - Booking services
            - General questions about creative services
            
            Keep responses helpful, friendly, and focused on the Brand Connect platform. If asked about topics unrelated to creative services or the platform, politely redirect the conversation back to how you can help with Brand Connect.`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', errorData)
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    const aiMessage = data.choices?.[0]?.message?.content || 'I apologize, but I cannot provide a response at the moment. Please try again later.'

    return new Response(
      JSON.stringify({ message: aiMessage }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  } catch (error) {
    console.error('AI Chat error:', error)
    
    return new Response(
      JSON.stringify({ 
        message: "I'm sorry, I'm having trouble responding right now. Please try again later or contact our support team for assistance." 
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
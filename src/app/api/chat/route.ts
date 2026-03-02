import { NextResponse } from 'next/server';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

// Groq configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(req: Request) {
  if (!GROQ_API_KEY) {
    return NextResponse.json(
      {
        error:
          'AI is not configured: add GROQ_API_KEY in environment variables.',
      },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { messages, context } = (body as { messages?: ChatMessage[], context?: any }) ?? {};
  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: 'Request body must include a messages array.' },
      { status: 400 },
    );
  }

  const formattedMessages = messages
    .filter(
      (msg): msg is ChatMessage =>
        msg != null &&
        typeof msg.content === 'string' &&
        typeof msg.role === 'string' &&
        msg.role !== 'system',
    )
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content.slice(0, 1200),
    }));

  if (formattedMessages.length === 0) {
    return NextResponse.json(
      { error: 'No valid user messages found.' },
      { status: 400 },
    );
  }

  try {
    const systemPrompt = `You are the advanced AI interface of the Krythos systems, serving as the sophisticated digital assistant for Raj Raunak Kumar. Raj is an elite systems engineer, PhD Scholar at IIT Patna (CSE), and holds a Masters from MIT Manipal (9.03 GPA). His expertise lies in deep systems programming—building relational databases from scratch in Go, writing x64 bytecode compilers in C++, and engineering BitTorrent clients in Python. He is highly proficient in C, C++, Go, Rust, and Assembly. Your tone should be highly analytical, precise, sophisticated, and slightly sci-fi (like an advanced AI protocol), yet engaging and helpful. Provide concise, sharply intelligent answers, showcasing his achievements in distributed systems, machine learning, and core systems architecture when relevant. Keep replies relatively brief but technically accurate and impressive.

CURRENT USER CONTEXT:
The user is currently executing queries from this interface:
URL: ${context?.url || 'Unknown'}
Page Title: ${context?.title || 'Unknown'}
Page Content Data Stream: ${context?.content || 'No page data provided'}

Always use the Page Content Data Stream to understand what the user is currently looking at. If they are writing a blog in the Admin Dashboard, act as a technical editorial assistant—help brainstorm, refine grammar, format code, and structure technical writing based on the words they have typed on the screen.`;

    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...formattedMessages,
    ];

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: finalMessages,
        max_tokens: 1024,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('Groq API error', response.status, details);
      return NextResponse.json(
        {
          error:
            'AI request failed. Check API key, model name, or try again shortly.',
          details,
        },
        { status: 500 },
      );
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      'I could not generate a response right now.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat route error', error);
    return NextResponse.json(
      { error: 'Failed to process chat request.' },
      { status: 500 },
    );
  }
}


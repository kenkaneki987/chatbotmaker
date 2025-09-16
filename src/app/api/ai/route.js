export async function POST(req) {
  try {
    const { text, context } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Missing 'text'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server misconfigured: GEMINI_API_KEY missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const prompt = context ? `${context}\n\nUser: ${text}` : text;

    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text();
      return new Response(JSON.stringify({ error: "Gemini request failed", details: err }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await geminiResponse.json();
    return new Response(JSON.stringify({ response: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



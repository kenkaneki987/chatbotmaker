export async function POST(req) {
  try {
    const { text, context } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "Missing 'text'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

  // GEMINI_API_KEY should be set in the server environment (e.g. in
  // `.env.local` or your deployment environment variables). If the key is
  // missing, invalid, or expired the Gemini API will fail — update the key
  // and restart the Next.js server.
  const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing from environment variables");
      return new Response(JSON.stringify({ error: "Server misconfigured: GEMINI_API_KEY missing" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Making request to Gemini API with text:", text.substring(0, 50) + "...");
    const prompt = context ? `${context}\n\nUser: ${text}` : text;

    // Using gemini-2.5-flash which is available in the API
    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    console.log("Gemini API response status:", geminiResponse.status);

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text();
      console.error("Gemini API error response:", err);
      
      // Check for quota exceeded error (429)
      if (geminiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Gemini API quota exceeded", 
          details: "You have exceeded your Gemini API quota. Please wait or upgrade your plan.",
          userMessage: "The AI service is temporarily unavailable due to quota limits. Please try again later or contact support."
        }), {
          status: 429,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Gemini request failed", details: err }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await geminiResponse.json();
    console.log("Gemini API success, response received");
    return new Response(JSON.stringify({ response: data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API route error:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}



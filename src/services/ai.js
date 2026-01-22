/**
 * Send text/context to server-side AI route and return parsed JSON (or text).
 * Provides improved error messages and a clear hint when the server responds
 * with 401/403 (likely an expired/invalid Gemini API key on the server).
 */
export const askGemini = async ({ text, context }) => {
  try {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, context }),
    });

    // Try to parse JSON body if present, otherwise read as text
    const contentType = response.headers.get("content-type") || "";
    let parsedBody = null;
    let rawText = null;
    if (contentType.includes("application/json")) {
      try {
        parsedBody = await response.json();
      } catch (e) {
        // fall through to raw text
      }
    }
    if (parsedBody == null) {
      try {
        rawText = await response.text();
      } catch (e) {
        rawText = null;
      }
    }

    if (!response.ok) {
      const serverMessage = (parsedBody && (parsedBody.err || parsedBody.error || parsedBody.message)) || rawText || `Request failed with status ${response.status}`;

      // Inspect returned body for signs of auth issues because the server may
      // translate Gemini errors into a 502 with details (see server route).
      const detailsText = JSON.stringify(parsedBody ?? rawText ?? "");
      const looksLikeAuthIssue = /\b(401|403|unauthori|unauthenticated|invalid|expired|permission)\b/i.test(detailsText);

      if (response.status === 401 || response.status === 403 || looksLikeAuthIssue) {
        const hint = ' — possible expired/invalid Gemini API key on the server; please update GEMINI_API_KEY in the server environment (e.g. .env.local) and restart the app.';
        const fullMessage = `${serverMessage}${hint}`;
        console.error("askGemini auth-related error:", { status: response.status, body: parsedBody ?? rawText });
        throw new Error(fullMessage);
      }

      console.error("askGemini error response:", { status: response.status, body: parsedBody ?? rawText });
      throw new Error(serverMessage);
    }

    // Return parsed JSON when available, otherwise return raw text
    return parsedBody ?? rawText;
  } catch (error) {
    // Log and re-throw for caller to handle (so UI can show friendly messages)
    console.error("askGemini encountered an error:", error);
    throw error;
  }
};



import { createChatbot, verifyToken } from "../../utils";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.split(" ")[1];

    console.log("Create chatbot - Auth header present:", !!authHeader);
    console.log("Create chatbot - Token present:", !!accessToken);

    if (!accessToken) {
      console.log("Create chatbot - No token provided");
      return new Response(JSON.stringify({ err: "Unauthorized - No token provided" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isValidToken = await verifyToken(accessToken);
    console.log("Create chatbot - Token verification result:", isValidToken);

    if (!isValidToken) {
      console.log("Create chatbot - Token verification failed");
      return new Response(JSON.stringify({ err: "Unauthorized - Invalid or expired token. Please log in again." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const email = accessToken.split("#@#")[1];
    console.log("Create chatbot - User email:", email);
    
    const { name, context } = await req.json();
    await createChatbot({ name, context, email });
    return new Response(
      JSON.stringify({ message: "chatbot created successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.log("Create chatbot error:", err);
    return new Response(JSON.stringify({ err: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
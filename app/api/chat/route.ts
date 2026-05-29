import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are NeuraChat AI.",
        },
        {
          role: "user",
          content: body.message,
        },
      ],
    });

    return Response.json({
      reply: response.choices[0]?.message?.content || "No response",
    });
  } catch (error: any) {
    return Response.json({
      reply: error.message,
    });
  }
}
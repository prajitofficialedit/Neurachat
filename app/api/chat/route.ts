import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    return NextResponse.json({
      reply: "NeuraChat is working 🚀",
    });
  } catch (error) {
    return NextResponse.json({
      reply: "Error",
    });
  }
}
import { mux } from "@/services/mux.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await mux.video.assets.list();
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return new Response("Error fetching videos", { status: 500 });
  }
}

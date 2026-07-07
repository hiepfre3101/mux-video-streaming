import { mux } from "@/services/mux.service";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  try {
    const { assetId } = await params;
    const response = await mux.video.assets.retrieve(assetId);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return new Response("Error fetching videos", { status: 500 });
  }
}

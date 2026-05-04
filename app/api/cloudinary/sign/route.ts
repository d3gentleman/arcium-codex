import { NextRequest, NextResponse } from "next/server";
import { getCloudinarySignature } from "@/app/staff/modules/actions/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const paramsToSign = body?.paramsToSign ?? body ?? {};
    const { signature, timestamp } = await getCloudinarySignature(paramsToSign);

    return NextResponse.json({
      signature,
      timestamp,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign upload";
    const status = message === "Unauthorized" ? 401 : 500;

    return NextResponse.json(
      {
        error: message,
      },
      { status }
    );
  }
}

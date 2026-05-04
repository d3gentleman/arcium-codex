"use server";

import { headers } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@/lib/auth";

type SignatureParams = Record<string, string | number>;

export async function getCloudinarySignature(paramsToSign: SignatureParams) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error("Missing CLOUDINARY_API_SECRET");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      ...paramsToSign,
      timestamp,
    },
    apiSecret
  );

  return {
    signature,
    timestamp,
  };
}

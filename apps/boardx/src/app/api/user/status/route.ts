import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const req = await request.json();

  const response = NextResponse.json(
    { message: "Logged out successfully", success: true },
    { status: 200 }
  );
  const token = cookies().get("token")?.value || "";

  if (!token) return response;
  const data: any = jwt.verify(token, process.env.TOKEN_SECRET!);
  await db.user.update({
    where: {
      id: data.id,
    },
    data: {
      isOnline: req.status,
    },
  });
  return response;
}

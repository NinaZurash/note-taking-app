import { db } from "@/lib/db";
import { sendVerificationCode } from "@/lib/sendVerification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  try {
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (!existingUserByEmail) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 }
      );
    }
    const token = Math.floor(1000 + Math.random() * 9000);
    sendVerificationCode({ email, token });

    const updateVerification = await db.user.update({
      where: { email: email },
      data: {
        verificationToken: token,
        verificationTokenExpiry: new Date(Date.now() + 60000),
      },
    });
    const tokenTimer = setTimeout(() => {
      const asyncDeleteToken = async () => {
        const deleteToken = await db.user.update({
          where: { email: email },
          data: { verificationToken: null, verificationTokenExpiry: null },
        });
      };
      asyncDeleteToken();
    }, 60000);
    if (!updateVerification) {
      return NextResponse.json(
        {
          error: "Error updating verification",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: "Verification code sent" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Error sending verification code",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams;
  const email = query.get("email");
  const token = query.get("token")
    ? parseInt(query.get("token") as string)
    : null;

  console.log(email, token);
  if (!email || !token) {
    return NextResponse.json({ isValid: false }, { status: 400 });
  }
  try {
    const user = await db.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return NextResponse.json(
        {
          user: null,
          message: "user not found",
        },
        { status: 404 }
      );
    }
    if (!user.verificationToken || !user.verificationTokenExpiry) {
      return NextResponse.json(
        {
          isValid: false,
          message: "Token expired",
        },
        { status: 404 }
      );
    }
    const isValid =
      user.verificationToken === token &&
      user.verificationTokenExpiry > new Date();
    if (isValid) {
      await db.user.update({
        where: { email: email },
        data: {
          emailVerified: new Date(),
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });
    }
    return NextResponse.json({
      isValid: isValid,
    });
  } catch (error) {
    return NextResponse.json(
      {
        user: null,
        message: "Something went wrong",
      },
      { status: 404 }
    );
  }
}

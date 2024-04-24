"use client";

import SignIn from "@/components/forms/SignIn";
import { authOptions } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session && session.user.emailVerified) {
      router.push(`${BASE_URL}/`);
    }
  });

  return <SignIn />;
}

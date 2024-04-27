"use client";
import React from "react";

import { Boxes } from "./ui/background-boxes";
import { cn } from "@/lib/utils";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function BackgroundBoxesDemo() {
  return (
    <div className="h-screen gap-3 relative w-full overflow-hidden bg-slate-900  rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className={cn("md:text-4xl text-xl text-white relative z-20")}>
          Best Note Taking App!
        </h1>
        <p className="text-center mt-2 text-neutral-300 relative z-20">
          Sign in or create an account
        </p>
      </div>

      <Link
        href={`${BASE_URL}/sign-in`}
        className="z-30 font-semibold border text-xl px-6 py-4 text-white rounded-xl transform top-3/4 left-1/2 -translate-x-1/2 -translate-y-3/4 absolute"
      >
        Let&apos;s get started
      </Link>
    </div>
  );
}

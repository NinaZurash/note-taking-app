"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NavMenu() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const handleClick = () => {
    router.push("/sign-in");
  };
  const toggleMenu = () => {
    setShowUserMenu(!showUserMenu); // Toggle menu visibility
  };
  return (
    <div className="fixed z-30 h-16 bg-black w-full items-center bg-opacity-25 flex">
      <div className="flex w-full justify-end mr-20">
        {session?.user ? (
          <Button
            onClick={toggleMenu}
            className="flex gap-x-1 rounded-xl border bg-white px-4 py-2 text-slate-900 transition-colors duration-500 ease-in-out hover:bg-gray-100"
          >
            <User size={23} />
            {session.user.name
              ? session.user.name?.split(" ")[0]
              : session.user.username}
            <ChevronDown size={13} />
          </Button>
        ) : (
          <Link
            className="flex bg-slate-100 gap-x-3 rounded-xl border px-4 py-2"
            href={`${BASE_URL}/sign-in`}
          >
            <User size={23} />
            Sign in
          </Link>
        )}
      </div>
      <div
        id="userMenu"
        className={`absolute right-20 top-20 flex w-[260px] flex-col gap-4 rounded-lg bg-white py-3 shadow-[0_6px_18px_0_rgba(0,0,0,0.2)]  ${
          showUserMenu ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center p-4">
          <Image
            src={"/assets/icons8-user.gif"}
            alt="user image"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="max-w-fit overflow-hidden overflow-ellipsis whitespace-nowrap text-sm">
            {session?.user.email}lkndslflkn
          </span>
        </div>
        <div className="w-full border border-t-gray-100"></div>
        <Button
          className="bg-white px-5 font-medium text-slate-500 hover:bg-white"
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}

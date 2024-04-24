"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function NavMenu() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/sign-in");
  };
  return (
    <div className="fixed z-30 h-16 bg-black w-full items-center bg-opacity-25 flex">
      <div className="flex w-full justify-end">
        <Button onClick={handleClick} className="mx-7">
          user
        </Button>
      </div>
    </div>
  );
}

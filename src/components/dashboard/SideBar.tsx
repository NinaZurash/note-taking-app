"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  BadgeHelp,
  CircleUserRound,
  FileSearch2,
  Github,
  LayoutDashboard,
  LayoutList,
  ListCollapse,
  MessagesSquare,
  NotebookPen,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const NAVLIST = {
  "Dashboard/Home": {
    svg: <LayoutDashboard />,
    link: "/home",
  },
  Categories: {
    svg: <LayoutList />,
    link: `/categories`,
  },
  Notes: {
    svg: <ListCollapse />,
    link: "/notes",
  },
  Users: {
    svg: <Users />,
    link: "/users",
  },
  Profile: {
    svg: <CircleUserRound />,
    link: "/profile",
  },
  Documentation: {
    svg: <FileSearch2 />,
    link: "/documentation",
  },
  "GitHub Repository": {
    svg: <Github />,
    link: "https://github.com/NinaZurash/note-taking-app",
  },
  Feedback: {
    svg: <MessagesSquare />,
    link: "/feedback",
  },
  "Help/Support": {
    svg: <BadgeHelp />,
    link: "/help",
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="pb-12 w-1/5 font-robo bg-[#121621] fixed text-white h-screen">
      <div className="space-y-4 py-4">
        <div className="flex py-7 gap-3 px-6">
          <NotebookPen />
          <div className="text-lg">Note Taking App</div>
        </div>
        <hr className="h-[1px] mx-auto bg-[#434a60] border-0 rounded" />
        <div className="px-3 py-2">
          <div className="py-2  flex flex-col gap-1">
            {Object.entries(NAVLIST).map(([key, values]) => (
              <Link
                key={key}
                target={key === "GitHub Repository" ? "_blank" : "_self"}
                href={
                  key === "GitHub Repository"
                    ? values.link
                    : BASE_URL + values.link
                }
                className={`${
                  pathname === values.link
                    ? "bg-[#635bff] text-white"
                    : "text-[#b3b9c6] "
                } w-full px-4 rounded-xl py-3 gap-4 flex text-[0.875rem] font-[500] hover:bg-[#635bff]  hover:text-white`}
              >
                <span> {values.svg}</span>
                <span> {key}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

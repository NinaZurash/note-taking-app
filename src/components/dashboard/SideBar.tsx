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

export const NAVLIST = {
  "Dashboard/Home": {
    svg: <LayoutDashboard />,
    link: "#",
  },
  Categories: {
    svg: <LayoutList />,
    link: "#",
  },
  Notes: {
    svg: <ListCollapse />,
    link: "#",
  },
  Users: {
    svg: <Users />,
    link: "#",
  },
  Profile: {
    svg: <CircleUserRound />,
    link: "#",
  },
  Documentation: {
    svg: <FileSearch2 />,
    link: "#",
  },
  "GitHub Repository": {
    svg: <Github />,
    link: "#",
  },
  Feedback: {
    svg: <MessagesSquare />,
    link: "#",
  },
  "Help/Support": {
    svg: <BadgeHelp />,
    link: "#",
  },
};

export default function Sidebar() {
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
                href={values.link}
                className="w-full px-4 rounded-xl py-3 gap-4 flex text-[0.875rem] font-[500] hover:bg-[#635bff] text-[#b3b9c6] hover:text-white"
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

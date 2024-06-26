import SideBar from "@/components/dashboard/SideBar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <SideBar />
      <div className="ml-72 py-4">{children}</div>
    </div>
  );
}

import SideBar from "@/components/dashboard/SideBar";
import { ReactNode } from "react";

export default function Layout({
  children,
}: {
  children: ReactNode;
  home: ReactNode;
  categories: ReactNode;
}) {
  return (
    <div>
      <SideBar />
      <div className="ml-80 py-4">{children}</div>
    </div>
  );
}

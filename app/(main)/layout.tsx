import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-full">
      <div className="min-[320px]:hidden sm:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSideBar />
      </div>
      <main className="sm:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
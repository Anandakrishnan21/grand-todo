"use client";

import { useEffect } from "react";
import { redirect, usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useSession } from "next-auth/react";
import Header from "./header/Header";

function ClientWrapper({ children }) {
  const pathname = usePathname();
  const { status } = useSession();

  const showSidebarPaths = ["/home", "/inbox", "/group", "/day", "/coming"];

  const showSidebar =
    showSidebarPaths.includes(pathname) ||
    /^\/group\/groupTodo\/[a-zA-Z0-9-_]+$/.test(pathname);

  useEffect(() => {
    if (status === "unauthenticated" && showSidebar) {
      redirect("/");
    }
  }, [showSidebar, status]);

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <div className="flex">
          <Sidebar />
        </div>
      )}
      <div className="w-full overflow-auto">
        <Header />
        <div>{children}</div>
      </div>
    </div>
  );
}

export default ClientWrapper;

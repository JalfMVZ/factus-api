"use client";
import React from "react";
import { NavLogo } from "./NavLogo";
import { NavRoutes } from "./NavRoutes";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="bg-white border-b border-secondary-200 px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <NavLogo />
        <div className="flex items-center gap-4">
          <NavRoutes activeRoute={pathname} />
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

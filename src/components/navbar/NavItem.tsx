import React from "react";
import { NavItemProps } from "@/interfaces/navbar";

export const NavItem: React.FC<NavItemProps> = ({
  href,
  children,
  isActive = false,
}) => {
  return (
    <li>
      <a
        href={href}
        className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
          isActive
            ? "bg-invoice-100 text-invoice-800"
            : "text-secondary-600 hover:bg-invoice-50 hover:text-invoice-700"
        }`}
      >
        {children}
      </a>
    </li>
  );
};

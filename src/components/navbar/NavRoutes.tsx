import React from "react";
import { NavItem } from "./NavItem";
import { navigationRoutes } from "@/data/routes";
import { NavRoutesProps } from "@/interfaces/navbar";

export const NavRoutes: React.FC<NavRoutesProps> = ({ activeRoute = "/" }) => {
  return (
    <ul className="flex items-center space-x-1">
      {navigationRoutes.map((route) => (
        <NavItem
          key={route.path}
          href={route.path}
          isActive={activeRoute === route.path}
        >
          {route.label}
        </NavItem>
      ))}
    </ul>
  );
};

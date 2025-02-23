export interface Route {
  path: string;
  label: string;
  icon?: string;
}

export interface NavItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export interface NavRoutesProps {
  activeRoute?: string;
}

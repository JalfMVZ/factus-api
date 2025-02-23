"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      document.cookie = `access_token=${token}; path=/`;
    }
  }, []);

  return <>{children}</>;
}

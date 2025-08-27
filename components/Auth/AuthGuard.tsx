"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useUser } from "@/hooks/useUser";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <p className="mt-20 text-center">Loading...</p>;
  }

  return <>{children}</>;
}

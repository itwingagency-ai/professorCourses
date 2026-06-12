"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader/Loader";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
  const router = useRouter();
  const { user, authChecked } = useSelector((state: any) => state.auth);

  const isBlocked = user?.status === "blocked" || user?.status === "suspended";

  useEffect(() => {
    if (authChecked) {
      if (!user || isBlocked) {
        router.replace("/");
      } else if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "teacher") {
        // Teacher flow not built yet, but redirecting to /teacher for now
        router.replace("/teacher");
      }
    }
  }, [authChecked, user, isBlocked, router]);

  if (!authChecked) {
    return <Loader />;
  }

  if (!user || isBlocked || user.role === "admin" || user.role === "teacher") {
    return null;
  }

  return <>{children}</>;
}
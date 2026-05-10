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

  useEffect(() => {
    if (authChecked) {
      if (!user) {
        router.replace("/");
      } else if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "teacher") {
        // Teacher flow not built yet, but redirecting to /teacher for now
        router.replace("/teacher");
      }
    }
  }, [authChecked, user, router]);

  if (!authChecked) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
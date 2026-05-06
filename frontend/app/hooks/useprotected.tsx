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
    if (authChecked && !user) {
      router.replace("/");
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
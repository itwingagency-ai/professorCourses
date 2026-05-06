"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader/Loader";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
  const router = useRouter();
  const { user, authChecked } = useSelector((state: any) => state.auth);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (authChecked && (!user || !isAdmin)) {
      router.replace("/");
    }
  }, [authChecked, user, isAdmin, router]);

  if (!authChecked) {
    return <Loader />;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
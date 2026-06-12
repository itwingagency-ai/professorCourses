"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader/Loader";

interface ProtectedProps {
  children: React.ReactNode;
}

export default function TeacherProtected({ children }: ProtectedProps) {
  const router = useRouter();
  const { user, authChecked } = useSelector((state: any) => state.auth);

  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const isBlocked = user?.status === "blocked" || user?.status === "suspended";

  useEffect(() => {
    if (authChecked && (!user || !isTeacher || isBlocked)) {
      router.replace("/");
    }
  }, [authChecked, user, isTeacher, isBlocked, router]);

  if (!authChecked) {
    return <Loader />;
  }

  if (!user || !isTeacher || isBlocked) {
    return null;
  }

  return <>{children}</>;
}
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

  const isTeacher = user?.role === "teacher";

  useEffect(() => {
    if (authChecked && (!user || !isTeacher)) {
      router.replace("/");
    }
  }, [authChecked, user, isTeacher, router]);

  if (!authChecked) {
    return <Loader />;
  }

  if (!user || !isTeacher) {
    return null;
  }

  return <>{children}</>;
}
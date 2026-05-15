"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

/** Returns true if a logged-in user exists (any role). */
export default function useUserAuth(): boolean {
  const { user } = useSelector((state: any) => state.auth);
  return Boolean(user);
}

/**
 * Returns true if the user is a student.
 * Treats legacy role "user" as "student" for backward compatibility.
 */
export function useIsStudent(): boolean {
  const { user } = useSelector((state: any) => state.auth);
  return user?.role === "student" || user?.role === "user";
}

/** Returns true if the user is an admin. */
export function useIsAdmin(): boolean {
  const { user } = useSelector((state: any) => state.auth);
  return user?.role === "admin";
}

/** Returns true if the user is a teacher. */
export function useIsTeacher(): boolean {
  const { user } = useSelector((state: any) => state.auth);
  return user?.role === "teacher";
}
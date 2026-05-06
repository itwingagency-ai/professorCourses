"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";

export default function userAuth() {
  const { user } = useSelector((state: any) => state.auth);
  return Boolean(user);
}
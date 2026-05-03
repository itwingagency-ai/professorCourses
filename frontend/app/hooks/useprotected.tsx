/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import React from "react";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
    const isAuthenticated = userAuth(); // caaling userAuth function in userAuth.tsx
    return isAuthenticated ? children : redirect("/");
}
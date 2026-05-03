/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function AdminProtected({ children }: ProtectedProps) {
    const { user } = useSelector((state: any) => state.auth);
    // if user is logged in then true otherwise false

    if (user) {
        const isAdmin = user?.role === "admin";
        return isAdmin ? children : redirect("/");
    }
}
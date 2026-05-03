/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from "next/navigation";
import userAuth from "./userAuth";
import React from "react";
import { useSelector } from "react-redux";

interface ProtectedProps {
    children: React.ReactNode;
}

export default function TeacherProtected({ children }: ProtectedProps) {
    const { user } = useSelector((state: any) => state.auth);
    // if user is logged in then true otherwise false    
    if (user) {
        const isteacher = user?.role === "teacher";
        return isteacher ? children : redirect("/");
    }
}
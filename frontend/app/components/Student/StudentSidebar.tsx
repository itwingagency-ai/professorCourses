/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import avatarIcon from "../../../public/assests/avatar.png";
import {
  AiOutlineUser,
  AiOutlineBook,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineDashboard,
  AiOutlineHistory,
  AiOutlineQuestionCircle,
  AiOutlineSafetyCertificate,
} from "react-icons/ai";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

type Props = {
  user: any;
};

const navLinks = [
  { href: "/student/dashboard", icon: AiOutlineDashboard, label: "Dashboard" },
  { href: "/student/my-courses", icon: AiOutlineBook, label: "My Courses" },
  { href: "/student/orders", icon: AiOutlineHistory, label: "Orders" },
  { href: "/student/questions", icon: AiOutlineQuestionCircle, label: "My Questions" },
  { href: "/student/profile", icon: AiOutlineUser, label: "Profile" },
  { href: "/student/settings", icon: AiOutlineSetting, label: "Settings" },
];

const StudentSidebar: FC<Props> = ({ user }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutApi] = useLogOutMutation();

  const logOutHandler = async () => {
    try {
      await logoutApi({}).unwrap();
      await signOut({ redirect: false });
      toast.success("Signed out successfully");
      router.replace("/");
    } catch {
      await signOut({ redirect: false });
      router.replace("/");
    }
  };

  const userAvatar = user?.avatar?.url || avatarIcon;

  const isActive = (href: string) => pathname === href;

  return (
    <div className="w-full h-full p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm flex flex-col">
      {/* User Profile Section - Desktop */}
      <div className="hidden 800px:flex flex-col items-center py-6 px-3 mb-2 border-b border-gray-100 dark:border-white/5">
        <div className="relative">
          <Image
            src={userAvatar}
            alt="Profile"
            width={72}
            height={72}
            className="w-[72px] h-[72px] rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white dark:border-slate-900 rounded-full" />
        </div>
        <h2 className="text-[15px] font-Poppins font-[600] text-gray-900 dark:text-white mt-3 text-center truncate w-full">
          {user?.name || "Student"}
        </h2>
        <p className="text-[12px] text-gray-400 dark:text-gray-500 text-center truncate w-full mt-0.5">
          {user?.email || ""}
        </p>
        <span className="mt-2 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full uppercase tracking-wide">
          Student
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto py-2">
        {/* Mobile: horizontal scroll */}
        <div className="flex 800px:hidden overflow-x-auto gap-1 pb-1">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center min-w-[64px] p-2 rounded-xl transition-all duration-200 text-xs
                ${isActive(href)
                  ? "bg-primary text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary"
                }`}
            >
              <Icon size={20} />
              <span className="mt-1 whitespace-nowrap font-medium">{label.split(" ")[0]}</span>
            </Link>
          ))}
        </div>

        {/* Desktop: vertical nav */}
        {navLinks.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`hidden 800px:flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive(href)
                ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary border-l-[3px] border-primary font-semibold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary border-l-[3px] border-transparent"
              }`}
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="font-Poppins">{label}</span>
          </Link>
        ))}

        {/* Certificates - special disabled state */}
        <div className="hidden 800px:flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60 border-l-[3px] border-transparent">
          <AiOutlineSafetyCertificate size={18} className="flex-shrink-0" />
          <span className="font-Poppins flex-1">Certificates</span>
          <span className="text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-bold">
            SOON
          </span>
        </div>
      </nav>

      {/* Logout */}
      <div className="mt-2 pt-3 border-t border-gray-100 dark:border-white/5">
        <button
          onClick={logOutHandler}
          className="hidden 800px:flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 border-l-[3px] border-transparent"
        >
          <AiOutlineLogout size={18} className="flex-shrink-0" />
          <span className="font-Poppins">Logout</span>
        </button>
        {/* Mobile logout */}
        <button
          onClick={logOutHandler}
          className="800px:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
        >
          <AiOutlineLogout size={16} />
          <span className="font-Poppins font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "../../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiArrowLeft } from "react-icons/hi";
import avatarIcon from "../../../public/assests/avatar.png";
import NotificationBell from "../NotificationBell";
import { usePathname } from "next/navigation";

type Props = {
  user: any;
  setOpenSidebar?: (open: boolean) => void;
};

const pageTitles: Record<string, string> = {
  "/student/dashboard": "Dashboard",
  "/student/my-courses": "My Courses",
  "/student/orders": "Orders",
  "/student/questions": "My Questions",
  "/student/profile": "Profile",
  "/student/settings": "Settings",
};

const StudentHeader: FC<Props> = ({ user, setOpenSidebar }) => {
  const userAvatar = user?.avatar?.url || avatarIcon;
  const pathname = usePathname();
  const pageTitle = (pathname && pageTitles[pathname]) || "Student Portal";

  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-4 sm:px-6 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-gray-100 dark:border-white/5 shadow-sm">
      {/* Left: Menu toggle + Page Title */}
      <div className="flex items-center gap-3">
        {setOpenSidebar && (
          <button
            onClick={() => setOpenSidebar(true)}
            className="800px:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Open sidebar"
          >
            <HiOutlineMenuAlt3 size={22} />
          </button>
        )}
        <div>
          <h1 className="text-base font-Poppins font-[600] text-gray-900 dark:text-white leading-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-Inter hidden sm:block">
            Student Portal
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeSwitcher />
        <NotificationBell />
        <Link href="/student/profile" aria-label="Go to profile">
          <div className="relative">
            <Image
              src={userAvatar}
              alt="Profile"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full cursor-pointer object-cover ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default StudentHeader;

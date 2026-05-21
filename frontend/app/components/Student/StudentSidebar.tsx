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
} from "react-icons/ai";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";

type Props = {
  user: any;
};

const StudentSidebar: FC<Props> = ({ user }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutApi] = useLogOutMutation();

  const logOutHandler = async () => {
    await logoutApi({}).unwrap().catch(() => {});
    await signOut({ redirect: false });
    router.replace("/");
  };

  const userAvatar = user?.avatar?.url || avatarIcon;

  const itemBase = "w-full flex items-center px-4 py-4 transition rounded-md";
  const itemActive = "bg-[#37a39a] text-white";
  const itemInactive = "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800";

  const getLinkClass = (path: string) => {
    return `${itemBase} ${pathname === path ? itemActive : itemInactive}`;
  };

  return (
    <div className="w-full h-full p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] rounded-2xl shadow-sm">
      <div className="flex 800px:flex-col items-center 800px:items-start gap-4 800px:gap-0 overflow-x-auto 800px:overflow-visible">
        <div className="hidden 800px:flex flex-col items-center w-full py-5 border-b border-gray-200 dark:border-[#ffffff1d] mb-3">
          <Image
            src={userAvatar}
            alt="profile"
            width={70}
            height={70}
            className="w-[70px] h-[70px] rounded-full object-cover"
          />
          <h2 className="text-[18px] font-Poppins font-[600] text-black dark:text-white mt-3 text-center">
            {user?.name || "Student"}
          </h2>
          <p className="text-[13px] text-gray-500 dark:text-gray-300 text-center">
            {user?.email || ""}
          </p>
        </div>

        <Link href="/student/dashboard" className={getLinkClass("/student/dashboard")}>
          <AiOutlineDashboard size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">Dashboard</span>
        </Link>

        <Link href="/student/my-courses" className={getLinkClass("/student/my-courses")}>
          <AiOutlineBook size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">My Courses</span>
        </Link>

        <Link href="/student/orders" className={getLinkClass("/student/orders")}>
          <AiOutlineHistory size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">Orders</span>
        </Link>

        <Link href="/student/questions" className={getLinkClass("/student/questions")}>
          <AiOutlineQuestionCircle size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">My Questions</span>
        </Link>

        <Link href="/student/profile" className={getLinkClass("/student/profile")}>
          <AiOutlineUser size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">Profile</span>
        </Link>

        <Link href="/student/settings" className={getLinkClass("/student/settings")}>
          <AiOutlineSetting size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">Settings</span>
        </Link>

        <button onClick={logOutHandler} className={`${itemBase} ${itemInactive}`}>
          <AiOutlineLogout size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;

"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import Image from "next/image";
import avatarIcon from "../../../public/assests/avatar.png";
import {
  AiOutlineUser,
  AiOutlineBook,
  AiOutlineLock,
  AiOutlineLogout,
} from "react-icons/ai";

type Props = {
  user: any;
  active: number;
  avatar: any;
  setActive: (active: number) => void;
  logOutHandler: () => void;
};

const SideBarProfile: FC<Props> = ({
  user,
  active,
  avatar,
  setActive,
  logOutHandler,
}) => {
  const userAvatar = avatar || user?.avatar?.url || avatarIcon;

  const itemBase =
    "w-full flex items-center px-4 py-4 cursor-pointer transition rounded-md";
  const itemActive = "bg-[#37a39a] text-white";
  const itemInactive =
    "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800";

  return (
    <div className="w-full h-full p-3">
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
            {user?.name || "User"}
          </h2>

          <p className="text-[13px] text-gray-500 dark:text-gray-300 text-center">
            {user?.email || ""}
          </p>
        </div>

        <button
          onClick={() => setActive(1)}
          className={`${itemBase} ${active === 1 ? itemActive : itemInactive}`}
        >
          <AiOutlineUser size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">
            My Profile
          </span>
        </button>

        <button
          onClick={() => setActive(2)}
          className={`${itemBase} ${active === 2 ? itemActive : itemInactive}`}
        >
          <AiOutlineBook size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">
            My Courses
          </span>
        </button>

        <button
          onClick={() => setActive(3)}
          className={`${itemBase} ${active === 3 ? itemActive : itemInactive}`}
        >
          <AiOutlineLock size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">
            Change Password
          </span>
        </button>

        <button
          onClick={logOutHandler}
          className={`${itemBase} ${itemInactive}`}
        >
          <AiOutlineLogout size={22} />
          <span className="hidden 800px:block pl-3 font-Poppins">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default SideBarProfile;

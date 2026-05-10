/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import { ThemeSwitcher } from "../../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import avatarIcon from "../../../public/assests/avatar.png";

type Props = {
  user: any;
  setOpenSidebar?: (open: boolean) => void;
};

const StudentHeader: FC<Props> = ({ user, setOpenSidebar }) => {
  const userAvatar = user?.avatar?.url || avatarIcon;

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-[#ffffff1d]">
      <div className="flex items-center">
        {setOpenSidebar && (
          <HiOutlineMenuAlt3
            size={25}
            className="cursor-pointer dark:text-white text-black mr-4 block 800px:hidden"
            onClick={() => setOpenSidebar(true)}
          />
        )}
        <h1 className="text-[20px] font-Poppins font-[600] text-black dark:text-white hidden sm:block">
          Student Portal
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Link href="/student/profile">
          <Image
            src={userAvatar}
            alt="profile"
            width={35}
            height={35}
            className="w-[35px] h-[35px] rounded-full cursor-pointer border-2 border-[#37a39a]"
          />
        </Link>
      </div>
    </div>
  );
};

export default StudentHeader;

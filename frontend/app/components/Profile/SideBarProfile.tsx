/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

import Image from 'next/image';
import React, { FC } from 'react';
import avatarDefault from "../../../public/assests/avatar.png";
import { RiAwardLine, RiLockPasswordLine } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { AiOutlineLogout } from 'react-icons/ai';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import Link from 'next/link';

type Props = {
    user: any;
    active: number;
    avatar: string | null;
    setActive: (active: number) => void;
    logOutHandler: () => void; // more specific type for clarity
};

const SideBarProfile: FC<Props> = ({ user, active, avatar, setActive, logOutHandler }) => {
    // Helper function to conditionally apply active styles
    const activeStyle = "border bg-[#e6f5f2] dark:bg-slate-800 dark:border-[#ffffff1d] border-[#00000014] rounded-[5px]";

    return (
        <div className="w-full space-y-2">
            {/* My Account Section */}
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 1 ? activeStyle : ""}`}
                onClick={() => setActive(1)}
            >
                <Image
                    className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] rounded-full"
                    src={user.avatar || avatar ? user.avatar.url : avatarDefault}
                    alt=""
                    width={20}
                    height={20}
                />
                <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                    My Account
                </h5>
            </div>

            {/* Change Password Section */}
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 2 ? activeStyle : ""}`}
                onClick={() => setActive(2)}
            >
                <RiLockPasswordLine className="stroke-black dark:stroke-white text-black dark:text-white" size={20} />
                <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                    Change Password
                </h5>
            </div>

            {/* Enrolled Courses Section */}
            {
                user && user.role === "user" && (
                    <div
                        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 3 ? activeStyle : ""}`}
                        onClick={() => setActive(3)}
                    >
                        <SiCoursera className="stroke-black dark:stroke-white text-black dark:text-white" size={20} />
                        <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                            Enrolled Courses
                        </h5>
                    </div>
                )
            }
            {/* Logic for admin/teacher panel */}
            {
                user && user.role === "admin" && (
                    <Link
                        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 6 ? activeStyle : ""}`}
                        href={"/admin"}
                    >
                        <MdOutlineAdminPanelSettings className="stroke-black dark:stroke-white text-black dark:text-white" size={20} />
                        <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                            Admin Panel
                        </h5>
                    </Link>
                )
            }
            {
                user && user.role === "teacher" && (
                    <Link
                        className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 6 ? activeStyle : ""}`}
                        href={"/teacher"}
                    >
                        <MdOutlineAdminPanelSettings className="stroke-black dark:stroke-white text-black dark:text-white" size={20} />
                        <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                            Teacher Admin Panel
                        </h5>
                    </Link>
                )}
            {/* Certificates Section */}
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 4 ? activeStyle : ""}`}
                onClick={() => setActive(4)}
            >
                <RiAwardLine className="stroke-black dark:stroke-white text-black dark:text-white" size={20} />
                <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                    Certificates
                </h5>
            </div>

            {/* Log Out Section */}
            <div
                className={`w-full flex items-center px-3 py-4 cursor-pointer ${active === 5 ? activeStyle : ""}`}
                onClick={logOutHandler}
            >
                <AiOutlineLogout className="stroke-black dark:stroke-white text-black dark:text-white" size={20} />
                <h5 className="pl-2 hidden 800px:block font-Poppins text-black dark:text-white">
                    Log Out
                </h5>
            </div>
        </div>
    );
};

export default SideBarProfile;

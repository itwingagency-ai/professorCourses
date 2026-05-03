/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import React, { FC, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";


type Props = {

};

const TeacherDashboardHeader: FC<Props> = () => {

  const [open, setOpen] = useState(false);
  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
      <ThemeSwitcher />
      <div className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl  cursor-pointer dark:text-white text-black " />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white ">
          3
        </span>
      </div>
      {open && (
        // <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl  absolute top-16 z-10 rounded ">
        //   <h5 className="text-center  text-[20px] font-Poppins text-black dark:text-white p-3 ">
        //     Notifications
        //   </h5>
        //   <div className="dark:bg-[#d1aaaa13] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] " >
        //     <div className="w-full flex items-center justify-between p-2" >
        //       <p className="text-black dark:text-white">
        //         New Question Recieved
        //       </p>
        //       <p className="text-black dark:text-white cursor-pointer" >
        //         Mark as read
        //       </p>
        //     </div>
        //     <p className="px-2 text-black  dark:text-white" >
        //       Lorem ipsum dolor sit amet consectetur adipisicing elit.
        //       At, molestias amet esse perferendis dignissimos iure nam voluptate cupiditate porro dolorem distinctio. Doloribus temporibus consequatur, alias corrupti autem recusandae cumque maiores.
        //     </p>
        //     <p className=" p-2 text-black dark:text-white text-[14px] ">
        //       5 days ago
        //     </p>
        //   </div>
        //    <div className="dark:bg-[#d1aaaa13] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] " >
        //     <div className="w-full flex items-center justify-between p-2" >
        //       <p className="text-black dark:text-white">
        //         New Question Recieved
        //       </p>
        //       <p className="text-black dark:text-white cursor-pointer" >
        //         Mark as read
        //       </p>
        //     </div>
        //     <p className="px-2 text-black  dark:text-white" >
        //       Lorem ipsum dolor sit amet consectetur adipisicing elit.
        //       At, molestias amet esse perferendis dignissimos iure nam voluptate cupiditate porro dolorem distinctio. Doloribus temporibus consequatur, alias corrupti autem recusandae cumque maiores.
        //     </p>
        //     <p className=" p-2 text-black dark:text-white text-[14px] ">
        //       5 days ago
        //     </p>
        //   </div>
        // </div>
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded overflow-y-auto">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>

          {/* Notification Item */}
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="dark:bg-[#d1aaaa13] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] p-3"
            >
              <div className="w-full flex items-center justify-between">
                <p className="text-black dark:text-white font-medium">
                  New Question Received
                </p>
                <p className="text-black dark:text-white cursor-pointer hover:underline">
                  Mark as read
                </p>
              </div>
              <p className="mt-2 text-black dark:text-white text-sm leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At, molestias amet esse
                perferendis dignissimos iure nam voluptate cupiditate porro dolorem distinctio.
                Doloribus temporibus consequatur, alias corrupti autem recusandae cumque maiores.
              </p>
              <p className="mt-3 text-black dark:text-white text-xs font-light">
                5 days ago
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboardHeader;
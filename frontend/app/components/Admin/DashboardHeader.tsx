/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import React, { FC, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useGetNotificationsQuery, useUpdateNotificationStatusMutation } from "@/redux/features/notifications/notificationsApi";
import { format } from "timeago.js";

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateNotificationStatus, { isSuccess }] = useUpdateNotificationStatusMutation();

  const handleUpdateStatus = async (id: string) => {
    await updateNotificationStatus(id);
  };

  const notifications = data?.notifications || [];

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 ">
      <ThemeSwitcher />
      <div className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl  cursor-pointer dark:text-white text-black " />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white ">
          {notifications.filter((item: any) => item.status === "unread").length}
        </span>
      </div>
      {open && (
        <div className="w-[350px] h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded overflow-y-auto">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>

          {notifications.map((item: any, index: number) => (
            <div
              key={index}
              className="dark:bg-[#d1aaaa13] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f] p-3"
            >
              <div className="w-full flex items-center justify-between">
                <p className="text-black dark:text-white font-medium">
                  {item.title}
                </p>
                <p 
                  className="text-black dark:text-white cursor-pointer hover:underline"
                  onClick={() => handleUpdateStatus(item._id)}
                >
                  Mark as read
                </p>
              </div>
              <p className="mt-2 text-black dark:text-white text-sm leading-relaxed">
                {item.message}
              </p>
              <p className="mt-3 text-black dark:text-white text-xs font-light">
                {format(item.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
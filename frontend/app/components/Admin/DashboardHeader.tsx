/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"
import { ThemeSwitcher } from "@/app/utils/ThemeSwitcher";
import React, { FC } from "react";
import NotificationBell from "../NotificationBell";

type Props = {
  open?: boolean;
  setOpen?: any;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-[1000] space-x-4">
      <ThemeSwitcher />
      <NotificationBell />
    </div>
  );
};

export default DashboardHeader;
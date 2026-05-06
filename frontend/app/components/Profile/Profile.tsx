/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client";

import React, { FC, useState, useEffect } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import MyCourses from "./MyCourses";

type Props = {
  user: any;
};

const Profile: FC<Props> = ({ user }) => {
  const router = useRouter();

  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);

  const [logOut] = useLogOutMutation();

  const logOutHandler = async () => {
    try {
      await logOut({}).unwrap();

      await signOut({
        redirect: false,
      });

      toast.success("Logout Successfully!");
      router.push("/");
    } catch (error: any) {
      await signOut({
        redirect: false,
      });

      toast.success("Logout Successfully!");
      router.push("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="w-[95%] 800px:w-[85%] flex flex-col 800px:flex-row mx-auto gap-6">
      <div
        className={`w-full 800px:w-[310px] h-fit 800px:h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000014] rounded-[8px] shadow-xl dark:shadow-sm mt-[40px] 800px:mt-[80px] mb-[20px] 800px:mb-[80px] 800px:sticky ${
          scroll ? "800px:top-[120px]" : "800px:top-[30px]"
        }`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>

      <div className="flex-1 h-full border-transparent mt-[20px] 800px:mt-[80px] mb-[80px]">
        {active === 1 && <ProfileInfo avatar={avatar} user={user} />}

        {active === 2 && <MyCourses user={user} />}

        {active === 3 && <ChangePassword />}
      </div>
    </div>
  );
};

export default Profile;
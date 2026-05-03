/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import React, { FC, useState, useEffect } from 'react';
import SideBarProfile from './SideBarProfile';
import { useLogOutQuery } from '@/redux/features/auth/authApi';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
type Props = {
    user: any;
}

const Profile: FC<Props> = ({ user }) => {
    const [scroll, setScroll] = useState(false);
    const [avatar, setAvatar] = useState(null); //  null sometime user Done't have avatar
    const [active, setActive] = useState(1);
    const [logout, setLogout] = useState(false);
    const { } = useLogOutQuery(undefined, {
        skip: !logout, // if logout is false then true otherwise false    
    }); // eslint-disable-line @typescript-eslint/no-unused-vars

    const logOutHandler = async () => {
        // at first it will expire the session and redirect to homepage (Header(already protected) in our case and we are calling setLogout(true); again)
        try {
            setLogout(true); // calling our api
            signOut(); // removing session and get's reload and not calling our api yet if ( social login)
            toast.success("Logout Successfully!");
        } catch (error) {
            if (error) {
                toast.error(" Error while logging out!:", error);
            }
        }

    }
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", () => {
                if (window.scrollY > 85) {
                    setScroll(true);
                } else {
                    setScroll(false);
                }
            });
        }
    }, []);

    return (
        <div className="w-[85%] flex mx-auto  ">
            <div
                className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90  border bg-white dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] shadow-xl dark:shadow-sm mt-[80px] mb-[80px] sticky ${scroll ? "top-[120px]" : "top-[30px]"
                    } left[30px] `}
            >
                <SideBarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logOutHandler={logOutHandler} />
            </div>
            {
                active === 1 && (
                    <div className="w-full h-full border-transparent mt-[80px]">
                        <ProfileInfo
                            avatar={avatar}
                            user={user}
                        />
                    </div>
                )
            }
            {
                active === 2 && (
                    <div className="w-full h-full border-transparent mt-[80px]">
                        <ChangePassword
                        />
                    </div>
                )
            }
        </div>
    )
}

export default Profile;
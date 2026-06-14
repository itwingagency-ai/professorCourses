/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { FC, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";

import {
    HomeOutlinedIcon,
    ArrowForwardIosIcon,
    ArrowBackIosIcon,
    PeopleOutlinedIcon,
    ReceiptOutlinedIcon,
    BarChartOutlinedIcon,
    MapOutlinedIcon,
    GroupsIcon,
    OndemandVideoIcon,
    VideoCallIcon,
    WebIcon,
    QuizIcon,
    WysiwygIcon,
    ManageHistoryIcon,
    ExitToAppIcon
} from "./Icon";
import avatarDefault from "../../../../public/assests/avatar.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Box, IconButton, Typography } from "@mui/material";
import { useLogOutMutation } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";

interface itemProps {
    title: string;
    to: string;
    icon: JSX.Element;
}

const Item: FC<itemProps> = ({ title, to, icon }) => {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = pathname === to || (pathname?.startsWith(`${to}/`) ?? false);

    return (
        <MenuItem
            active={isActive}
            icon={icon}
            onClick={() => router.push(to)}
            style={{ cursor: "pointer" }}
        >
            <Typography className="!text-[16px] !font-Poppins ">{title}</Typography>
        </MenuItem>
    );
};

const sidebar = () => {
    const { user } = useSelector((state: any) => state.auth);
    const [logoutApi] = useLogOutMutation();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => setMounted(true), []);
    if (!mounted) {
        return null;
    }
    const logoutHandler = async () => {
        await logoutApi({}).unwrap().catch(() => {});
        await signOut({ redirect: false });
        router.replace("/");
    };
    return (
        <Box
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${theme === "dark" ? "#111C43 !important" : "#fff !important"
                        }`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },

                "& .pro-inner-item:hover": {
                    color: "#868dfb !important"
                },

                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },

                "& .pro-inner-item": {
                    padding: " 5px 35px 5px 20px !important",
                    opacity: 1,
                },
                "& .pro-menu-item": {
                    color: `${theme !== "dark" && "#000"}`,
                },
            }}
            className="!bg-white dark:bg-[#111C43]"
        >
            <ProSidebar
                collapsed={isCollapsed}
                style={{
                    position:"fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: isCollapsed ? "0%" : "16%",
                }}
            >
                <Menu iconShape="square">
                    {/* Logo and Menu Icon */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <ArrowForwardIosIcon /> : undefined}
                        style={{
                            margin: "10px 0 20px 0",
                        }}
                    >
                        {
                            !isCollapsed && (
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    ml="15px"
                                >
                                    <Link href="/admin">
                                        <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black ">
                                            The3S
                                        </h3>
                                    </Link>
                                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)} className="inline-block">
                                        <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                                    </IconButton>
                                </Box>
                            )
                        }
                    </MenuItem>
                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Image
                                    alt="profile-user"
                                    width={100}
                                    height={100}
                                    src={user.avatar ? user.avatar.url : avatarDefault}
                                    style={{
                                        cursor: "pointer",
                                        borderRadius: "50%",
                                        border: " 3px solid #5b6fe6",
                                    }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h4"
                                    className="!text-[20px] font-Poppins  dark:text-white text-black"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    {user?.name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    className="!text-[20px] font-Poppins capitalize dark:text-white text-black"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    - {user?.role}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Dashboard"
                            to="/admin"
                            icon={<HomeOutlinedIcon />}
                        />
                        <Item
                            title="Notifications"
                            to="/admin/notifications"
                            icon={<ManageHistoryIcon />}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 20px" }}
                            className="!text-[18px] text-black dark:text-white capitalzie !font-[400]">
                            {!isCollapsed && "Data"}
                        </Typography>
                        <Item
                            title="Users"
                            to="/admin/users"
                            icon={<GroupsIcon />}
                        />
                        <Item
                            title="Invoices"
                            to="/admin/invoices"
                            icon={<ReceiptOutlinedIcon />}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 20px" }}
                            className="!text-[18px] text-black dark:text-white capitalzie !font-[400]">
                            {!isCollapsed && "Content"}
                        </Typography>
                        <Item
                            title="Create Course"
                            to="/admin/create-course"
                            icon={<VideoCallIcon />}
                        />
                        <Item
                            title="Live Courses"
                            to="/admin/courses"
                            icon={<OndemandVideoIcon />}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 20px" }}
                            className="!text-[18px] text-black dark:text-white capitalzie !font-[400]">
                            {!isCollapsed && "Academic"}
                        </Typography>
                        <Item
                            title="Quizzes"
                            to="/admin/quizzes"
                            icon={<QuizIcon />}
                        />
                        <Item
                            title="Assignments"
                            to="/admin/assignments"
                            icon={<WysiwygIcon />}
                        />
                        <Item
                            title="Submissions"
                            to="/admin/submissions"
                            icon={<ReceiptOutlinedIcon />}
                        />
                        <Item
                            title="Quiz Attempts"
                            to="/admin/quiz-attempts"
                            icon={<ManageHistoryIcon />}
                        />
                        <Item
                            title="Certificates"
                            to="/admin/certificates"
                            icon={<WebIcon />}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 20px" }}
                            className="!text-[18px] text-black dark:text-white capitalzie !font-[400]">
                            {!isCollapsed && "Customization"}
                        </Typography>
                        <Item
                            title="Hero"
                            to="/admin/hero"
                            icon={<WebIcon />}
                        />
                        <Item
                            title="FAQ"
                            to="/admin/faq"
                            icon={<QuizIcon />}
                        />
                        <Item
                            title="Categories"
                            to="/admin/categories"
                            icon={<WysiwygIcon />}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 20px" }}
                            className="!text-[18px] text-black dark:text-white capitalzie !font-[400]">
                            {!isCollapsed && "Controllers"}
                        </Typography>
                        <Item
                            title="Manage Team"
                            to="/admin/team"
                            icon={<PeopleOutlinedIcon />}
                        />
                        <Typography
                            variant="h5"
                            sx={{ m: "15px 0 5px 20px" }}
                            className="!text-[18px] text-black dark:text-white capitalzie !font-[400]">
                            {!isCollapsed && "Analytics"}
                        </Typography>
                        <Item
                            title="Courses Analytics"
                            to="/admin/courses-analytics"
                            icon={<BarChartOutlinedIcon />}
                        />
                        <Item
                            title="Order Analytics"
                            to="/admin/orders-analytics"
                            icon={<MapOutlinedIcon />}
                        />
                        <Item
                            title="Users Analytics"
                            to="/admin/users-analytics"
                            icon={<ManageHistoryIcon />}
                        />
                        <Item
                            title="Audit Logs"
                            to="/admin/audit-logs"
                            icon={<MapOutlinedIcon />}
                        />
                        <MenuItem
                            icon={<ExitToAppIcon />}
                            onClick={logoutHandler}
                            style={{ cursor: "pointer" }}
                        >
                            <Typography className="!text-[16px] !font-Poppins">
                                Logout
                            </Typography>
                        </MenuItem>
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};
export default sidebar;
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'
import UserAnalytics from '../Analytics/UserAnalytics';
import { BiBorderLeft } from 'react-icons/bi';
import { PiUsersFourLight, PiChalkboardTeacher, PiStudent, PiBookOpenText, PiBookBookmark } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from '../Analytics/OrdersAnalytics';
import AlInvoices from "../Order/AllInvoices";
import { useGetAdminDashboardQuery } from '@/redux/features/admin/adminApi';

type Props = {
    open?: boolean;
    value?: number;
}

const CircularProgressWithLabel: FC<Props> = ({ value, open }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
                variant="determinate"
                value={value}
                size={45}
                color={value && value > 99 ? "info" : "error"} // color options
                thickness={4}
                style={{ zIndex: open ? -1 : 1 }}
            />
            <Box
                sx={{
                    top: 0, left: 0, right: 0, bottom: 0,
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center', alignItems: 'center'
                }}
            ></Box>
        </Box>
    )
}

const DashboardWidgets: FC<Props> = ({ open }) => {
    const { data, isLoading } = useGetAdminDashboardQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const stats = data?.stats;

    return (
        <div className="mt-[35px] min-h-screen">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-6 sm:p-8 pb-4">
            {/* Total Users */}
            <div className="relative overflow-hidden bg-white dark:bg-[#111C43] rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-[#45CBA0]" />
                <div className="flex justify-between items-start pl-2">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Users</p>
                        <h5 className="font-Outfit text-3xl font-bold dark:text-white text-gray-900">
                            {isLoading ? <span className="inline-block w-12 h-8 skeleton rounded" /> : stats?.totalUsers ?? 0}
                        </h5>
                        <p className="text-xs text-gray-400 mt-2 font-Inter">
                            <span className="text-[#45CBA0] font-semibold">{stats?.totalStudents || 0}</span> Students
                            <span className="mx-1.5">·</span>
                            <span className="text-[#45CBA0] font-semibold">{stats?.totalTeachers || 0}</span> Teachers
                        </p>
                    </div>
                    <div className="bg-[#45CBA0]/10 p-2.5 rounded-xl">
                        <PiUsersFourLight className="text-[#45CBA0] text-2xl" />
                    </div>
                </div>
            </div>

            {/* Total Courses */}
            <div className="relative overflow-hidden bg-white dark:bg-[#111C43] rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-[#3b82f6]" />
                <div className="flex justify-between items-start pl-2">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Courses</p>
                        <h5 className="font-Outfit text-3xl font-bold dark:text-white text-gray-900">
                            {isLoading ? <span className="inline-block w-12 h-8 skeleton rounded" /> : stats?.totalCourses ?? 0}
                        </h5>
                        <p className="text-xs text-gray-400 mt-2 font-Inter">
                            <span className="text-[#3b82f6] font-semibold">{stats?.publishedCourses || 0}</span> Published
                        </p>
                    </div>
                    <div className="bg-[#3b82f6]/10 p-2.5 rounded-xl">
                        <PiBookOpenText className="text-[#3b82f6] text-2xl" />
                    </div>
                </div>
            </div>

            {/* Pending Courses */}
            <div className="relative overflow-hidden bg-white dark:bg-[#111C43] rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-[#f59e0b]" />
                <div className="flex justify-between items-start pl-2">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Pending Courses</p>
                        <h5 className="font-Outfit text-3xl font-bold dark:text-white text-gray-900">
                            {isLoading ? <span className="inline-block w-12 h-8 skeleton rounded" /> : stats?.pendingCourses ?? 0}
                        </h5>
                        <p className="text-xs text-gray-400 mt-2 font-Inter">
                            <span className="text-red-500 font-semibold">{stats?.rejectedCourses || 0}</span> Rejected
                        </p>
                    </div>
                    <div className="bg-[#f59e0b]/10 p-2.5 rounded-xl">
                        <PiBookBookmark className="text-[#f59e0b] text-2xl" />
                    </div>
                </div>
            </div>

            {/* Enrollments */}
            <div className="relative overflow-hidden bg-white dark:bg-[#111C43] rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-white/5 hover:shadow-md transition-shadow">
                <div className="absolute top-0 left-0 h-full w-1 rounded-l-2xl bg-[#ec4899]" />
                <div className="flex justify-between items-start pl-2">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Enrollments</p>
                        <h5 className="font-Outfit text-3xl font-bold dark:text-white text-gray-900">
                            {isLoading ? <span className="inline-block w-12 h-8 skeleton rounded" /> : stats?.totalOrders ?? 0}
                        </h5>
                        <p className="text-xs text-gray-400 mt-2 font-Inter">
                            <span className="text-[#ec4899] font-semibold">{stats?.freeEnrollments || 0}</span> Free
                        </p>
                    </div>
                    <div className="bg-[#ec4899]/10 p-2.5 rounded-xl">
                        <PiStudent className="text-[#ec4899] text-2xl" />
                    </div>
                </div>
            </div>
        </div>

            <div className="grid grid-cols-[75%,25%]">
                <div className="p-8 pt-0">
                    <UserAnalytics isDashboard={true} />
                </div>
                <div className="pr-8 pt-0">
                    <div className="w-full dark:bg-[#111C43] bg-slate-200 rounded-sm shadow">
                        <div className="flex justify-between items-center p-5 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gray-500/10 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                <span className="bg-black/80 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                                    Stripe Pending
                                </span>
                            </div>
                            <div className="opacity-50">
                                <BiBorderLeft className="dark:text-[#45CBA0] text-black text-[30px]" />
                                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
                                    {isLoading ? "..." : stats?.totalOrders}
                                </h5>
                                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[14px] font-[400]">
                                    Sales Obtained
                                </h5>
                            </div>
                            <div className="opacity-50">
                                <CircularProgressWithLabel value={100} open={open} />
                                <h5 className="text-center pt-4 dark:text-[#45CBA0] text-black text-sm">
                                    ${isLoading ? "..." : stats?.totalRevenue?.toFixed(2)}
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/** Order Analytics Grid */}
            <div className="grid grid-cols-[65%,35%] mt-[-20px]">
                <div className=" dark:bg-[#111C43] bg-slate-200 w-[94%] mt-[30px] h-[40vh] shadow m-auto rounded-sm ">
                    <OrdersAnalytics isDashboard={true} />
                </div>
                <div className="p-5">
                    <h5 className="dark:text-[#fff] text-black text-[20px] font-[400] font-Poppins pb-3">
                        Recent Transactions
                    </h5>
                    <AlInvoices isDashboard={true} />
                </div>
            </div>
        </div>
    )
}

export default DashboardWidgets;
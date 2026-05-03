/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'
import UserAnalytics from '../Analytics/UserAnalytics';
import { BiBorderLeft } from 'react-icons/bi';
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from '../Analytics/OrdersAnalytics';
import AlInvoices from "../Order/AllInvoices";
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
const DashboardWidgets: FC<Props> = ({open }) => {
    return (
        <div className="mt-[35px] min-h-screen ">
            <div className=" grid grid-cols-[75%,25%]">
                <div className="p-8 ">
                    <UserAnalytics isDashboard={true} />
                </div>
                <div className="pt-[80px] pr-8">
                    <div className="w-full dark:bg-[#111C43]  bg-slate-200 rounded-sm shadow">
                        <div className="flex justify-between items-center p-5">
                            <div className="">
                                <BiBorderLeft className="dark:text-[#45CBA0] text-black text-[30px]" />
                                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
                                    120
                                </h5>
                                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]">
                                    Sales Obtained
                                </h5>
                            </div>
                            <div>
                                <CircularProgressWithLabel value={100} open={open} />
                                <h5 className="text-center pt-4  dark:text-[#45CBA0] text-black"> +120%</h5>
                            </div>
                        </div>
                    </div>
                    < div className="w-full dark:bg-[#111C43] bg-slate-200 rounded-sm shadow my-8 ">
                        <div className="flex justify-between items-center p-5">
                            <div className="">
                                <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
                                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-[#000] text-[20px]">
                                    450
                                </h5>
                                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400] ">
                                    New Users
                                </h5>
                            </div>
                            <div>
                            <CircularProgressWithLabel value={100} open={open} />
                            <h5 className="text-center pt-4  dark:text-[#45CBA0] text-black"> +150%</h5>
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
                    <h5 className="dark:text-[#fff] text-black text-[20px] font-[400] font-Poopins pb-3">
                        Recent Transactions
                    </h5>
                    <AlInvoices isDashboard={true} />
                </div>
            </div>
        </div>
    )
}

export default DashboardWidgets;
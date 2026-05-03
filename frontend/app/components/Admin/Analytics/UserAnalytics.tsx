/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC, useEffect, useState } from 'react'
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';
import Loader from '../../Loader/Loader';
import { useGetUsersAnalyticsQuery } from '@/redux/features/analytics/analytics';
import { styles } from '@/app/styles/style';
//import {useApiSelector}  from "@/redux/store";
type Props = {
    isDashboard?: boolean;
}

const UserAnalytics: FC<Props> = ({ isDashboard }) => {
    const { data, isLoading, error } = useGetUsersAnalyticsQuery({});
    const [analyticsData, setAnalyticsData] = useState<any[]>([]); 
    {/**useState<any[]>([]): This calls the useState hook with an initial value of an empty array ([]). 
        The <any[]> part is TypeScript syntax specifying that the state variable analyticsData will hold 
        an array of elements of any type. */}
    // const analyticsData = [
    //     { name: 'january 2023', count: 440 },
    //     { name: 'february 2023', count: 8200 },
    //     { name: 'march 2023', count: 4033 },
    //     { name: 'april 2023', count: 4502 },
    //     { name: 'may 2023', count: 2042 },
    //     { name: 'june 2023', count: 3454 },
    //     { name: 'july 2023', count: 350 },
    //     { name: 'august 2023', count: 5666 },
    //     { name: 'september 2023', count: 620 },
    //     { name: 'october 2023', count: 640 },
    //     { name: 'november 2023', count: 660 },
    //     { name: 'december 2023', count: 680 },
    // ];

    useEffect(() => {
        const formattedData = (data?.users?.last12Months || []).map((item: any) => ({
            name: item.month,
            count: item.count,
          }));
          setAnalyticsData(formattedData); // Update state
    }, [data]); // Run effect whenever data changes
    
    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <div className={`${!isDashboard ? "mt-[50px]" : "mt-[50px] dark:bg-[#111C43]  bg-slate-200 shadow-sm pb-5 rounded-sm"}`} >
                        <div className={`${isDashboard ? "!ml-8 mb-5" : "ml-[50px]"}`}>
                            <h1 className={`${styles.title} ${isDashboard && '!text-[20px]'} px-5 !text-start`}>
                                Users Analytics
                            </h1>
                            {
                                !isDashboard && (
                                    <p className={`${styles.label} px-5`}>
                                        Last 12 Months Analytics Data {" "}
                                    </p>
                                )
                            }
                        </div>
                        <div className={` w-full ${isDashboard ? 'h-[30vh]' : 'h-screen'} flex items-center justify-center`}>
                            <ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={!isDashboard ? "50%" : "100%"}>
                                <AreaChart data={analyticsData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        bottom: 0,
                                        left: 0,
                                    }}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="count" stroke="#4d62d9" fill="#4d629d" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default UserAnalytics;
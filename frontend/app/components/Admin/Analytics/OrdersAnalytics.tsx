

// export default function OrdersAnalytics({ isDashboard }: Props) {
//     const { data, isLoading } = useGetOrdersAnalyticsQuery({});
//     const [analyticsData, setAnalyticsData] = useState<any[]>([]);

//     useEffect(() => {
//         const formattedData = (data?.users?.last12Months || []).map((item: any) => ({
//             name: item.month,
//             count: item.count,
//         }));
//         setAnalyticsData(formattedData); // Update state
//     }, [data]); // Run effect whenever data changes
//     return (
//         <>{
//             isLoading ? (
//                 <Loader />
//             ) : (

//                 <div className={`${isDashboard ? "h-[30vh]" : "h-screen"}`} >
//                     <div className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px] ml-[50px]"}>
//                         <h1 className={`${styles.title} ${isDashboard && '!text-[20px]'} px-5 !text-start`}>
//                             Orders Analytics
//                         </h1>
//                         {
//                             !isDashboard && (
//                                 <p className={`${styles.label} px-5`}>
//                                     Last 12 Months Analytics Data {" "}
//                                 </p>
//                             )
//                         }
//                     </div>
//                     <div className={` w-full ${!isDashboard ? 'h-[90%]' : 'h-full'} flex items-center justify-center`}>
//                         <ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={isDashboard ? "100%" : "50%"}>
//                             <LineChart width={500} height={300} data={analyticsData}
//                                 margin={
//                                     {
//                                         top: 5,
//                                         right: 30,
//                                         left: 20,
//                                         bottom: 5,
//                                     }
//                                 }
//                             >
//                                 <CartesianGrid strokeDasharray="3 3" />
//                                 <XAxis dataKey="name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 {!isDashboard && <Legend />}
//                                 <Line type="monotone" dataKey="count" stroke="#82ca9d" />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>

//                 </div>
//             )
//         }
//         </>
//     );
// };

/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from 'recharts';
import Loader from '../../Loader/Loader';
import { useGetOrdersAnalyticsQuery } from '@/redux/features/analytics/analytics';
import { styles } from '@/app/styles/style';
import toast from 'react-hot-toast';


type Props = {
    isDashboard?: boolean;
}

export default function OrdersAnalytics({ isDashboard }: Props) {
    const { data, isLoading, error } = useGetOrdersAnalyticsQuery({}); // Include error
    const [analyticsData, setAnalyticsData] = useState<any[]>([]);

    useEffect(() => {
        if (data?.orders?.last12Months) { //orders not users, also check if the data exists before mapping over it
            const formattedData = data.orders.last12Months.map((item: any) => ({
                name: item.month,
                count: item.count,
            }));
            setAnalyticsData(formattedData);
        } else if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }

    }, [data, error]); // Include error in dependency array
    const mockdata = [
        {
            name: "page A",
            cunt: 4000,
        },
        {
            name: "page B",
            cunt: 3000,
        },
        {
            name: "page C",
            cunt: 5000,
        },
        {
            name: "page D",
            cunt: 1000,
        },
        {
            name: "page E",
            cunt: 4000,
        },
        {
            name: "page F",
            cunt: 800,
        },
        {
            name: "page G",
            cunt: 200,
        },
    ];

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={`${isDashboard ? "h-[30vh]" : "h-screen"}`}>
                    <div className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px] ml-[50px]"}>
                        <h1 className={`${styles.title} ${isDashboard && '!text-[20px]'} px-5 !text-start`}>
                            Orders Analytics
                        </h1>
                        {!isDashboard && (
                            <>
                                <p className={`${styles.label} px-5`}>
                                    Last 12 Months Analytics Data
                                </p>
                                <div className="mt-4 mx-5 bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded max-w-[800px]">
                                    <h3 className="text-orange-500 font-bold">Payments Coming Soon</h3>
                                    <p className="text-gray-500 dark:text-gray-300 text-sm">Stripe integration and revenue analytics are planned for a future update. The chart below shows overall enrollments.</p>
                                </div>
                            </>
                        )}
                    </div>
                    <div className={`w-full ${!isDashboard ? 'h-[90%]' : 'h-full'} flex items-center justify-center`}>
                        <ResponsiveContainer width={isDashboard ? "100%" : "90%"} height={isDashboard ? "100%" : "50%"}>
                            <LineChart
                                width={500}
                                height={300}
                                data={analyticsData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                {!isDashboard && <Legend />}
                                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </>
    );
};



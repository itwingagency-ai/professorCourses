/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC, useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    Label,
    YAxis,
    LabelList
} from 'recharts';
import Loader from '../../Loader/Loader';
import { useGetCoursesAnalyticsQuery } from '@/redux/features/analytics/analytics';
import { styles } from '@/app/styles/style';
type Props = {}

const CourseAnalytics: FC<Props> = () => {
    const { data, isLoading } = useGetCoursesAnalyticsQuery({});
    // const analyticsData = [
    //     { name: 'jun 2023', uv: 3, },
    //     { name: 'july 2023', uv: 2, },
    //     { name: 'August 2023', uv: 5, },
    //     { name: 'September 2023', uv: 7, },
    //     { name: 'October 2023', uv: 2, },
    //     { name: 'November 2023', uv: 5, },
    //     { name: 'December 2023', uv: 7, },
    // ];
    const [analyticsData, setAnalyticsData] = useState<any[]>([]); // Use state
    const minValue = 0;

    useEffect(() => {
        
        const formattedData = (data?.courses?.last12Months || []).map((item: any) => ({
            name: item.month,
            uv: item.count,
          }));
          setAnalyticsData(formattedData); // Update state
    }, [data]); // Run effect whenever data changes
    
        
    return (
        <> {
            isLoading ? (
                <Loader />
            ) : (
                <div className="h-screen">
                    <div className="ml-[50px] mt-[90px]">
                        <h1 className={`${styles.title} px-5 !text-start`}>
                            Course Analytics
                        </h1>
                        <p className={`${styles.label} px-5`}>
                            Last 12 Months Analytics Data
                        </p>
                    </div>
                    <div className="w-full h-[90%] flex items-center justify-center">
                        <ResponsiveContainer width="90%" height="50%">
                            <BarChart width={150} height={300} data={analyticsData}>
                                <XAxis
                                    dataKey="name">
                                    <Label offset={0} position="insideBottom" />
                                </XAxis>
                                <YAxis domain={[minValue, "auto"]} />
                                <Bar dataKey="uv" fill="#3faf82" >
                                    <LabelList dataKey="uv" position="top" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )
        }
        </>
    )
}

export default CourseAnalytics;
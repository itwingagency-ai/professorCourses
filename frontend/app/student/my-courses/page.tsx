/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import Protected from "../../hooks/useprotected";
import Heading from "../../utils/Heading";
import StudentSidebar from "../../components/Student/StudentSidebar";
import StudentHeader from "../../components/Student/StudentHeader";
import StudentCourseCard from "../../components/Student/StudentCourseCard";
import { useGetStudentDashboardQuery } from "@/redux/features/student/studentApi";
import Link from "next/link";
import Loader from "../../components/Loader/Loader";

const MyCoursesPage: FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data, isLoading } = useGetStudentDashboardQuery(undefined, { refetchOnMountOrArgChange: true });

  const dashboardData = data?.data;
  const enrolledCourses = dashboardData?.enrolledCourses || [];

  return (
    <Protected>
      <Heading title={`My Courses - ${user?.name}`} description="Student courses" keywords="courses" />
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="hidden 800px:block w-1/5 min-w-[250px] p-4">
          <StudentSidebar user={user} />
        </div>
        {openSidebar && (
          <div className="fixed inset-0 z-[9999] bg-black/50 800px:hidden" onClick={() => setOpenSidebar(false)}>
            <div className="w-[250px] h-full bg-white dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
              <StudentSidebar user={user} />
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col w-full 800px:w-4/5">
          <StudentHeader user={user} setOpenSidebar={setOpenSidebar} />
          <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
            {isLoading ? <Loader /> : (
              <div className="max-w-[1200px] mx-auto">
                <h2 className="text-[24px] font-Poppins font-semibold text-black dark:text-white mb-6">My Courses</h2>
                {enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {enrolledCourses.map((c: any, index: number) => {
                      const p = dashboardData?.progressByCourse[c.courseId]?.progressPercentage || 0;
                      return <StudentCourseCard key={index} course={c} progressPercentage={p} />;
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                    <h3 className="text-[20px] font-semibold text-black dark:text-white">No courses yet</h3>
                    <p className="text-gray-500 mt-2 mb-6">You haven't enrolled in any courses.</p>
                    <Link href="/courses">
                      <button className="px-8 py-3 bg-[#37a39a] text-white rounded-lg font-semibold hover:bg-[#2b857d] transition">
                        Browse Courses
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </Protected>
  );
};
export default MyCoursesPage;

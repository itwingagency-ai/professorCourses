/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import Protected from "../../hooks/useprotected";
import Heading from "../../utils/Heading";
import StudentSidebar from "../../components/Student/StudentSidebar";
import StudentHeader from "../../components/Student/StudentHeader";
import StudentDashboardCards from "../../components/Student/StudentDashboardCards";
import StudentCourseCard from "../../components/Student/StudentCourseCard";
import StudentOrdersTable from "../../components/Student/StudentOrdersTable";
import { useGetStudentDashboardQuery } from "@/redux/features/student/studentApi";
import Link from "next/link";
import Loader from "../../components/Loader/Loader";

const DashboardPage: FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data, isLoading } = useGetStudentDashboardQuery(undefined, { refetchOnMountOrArgChange: true });

  const dashboardData = data?.data;

  return (
    <Protected>
      <Heading
        title={`Student Dashboard - ${user?.name}`}
        description="Student dashboard for LMS"
        keywords="student, dashboard, lms"
      />

      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Desktop Sidebar */}
        <div className="hidden 800px:block w-1/5 min-w-[250px] p-4">
          <StudentSidebar user={user} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {openSidebar && (
          <div
            className="fixed inset-0 z-[9999] bg-black/50 800px:hidden"
            onClick={() => setOpenSidebar(false)}
          >
            <div
              className="w-[250px] h-full bg-white dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <StudentSidebar user={user} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col w-full 800px:w-4/5">
          <StudentHeader user={user} setOpenSidebar={setOpenSidebar} />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
            {isLoading ? (
              <Loader />
            ) : (
              <div className="max-w-[1200px] mx-auto">
                <h2 className="text-[24px] font-Poppins font-semibold text-black dark:text-white mb-6">
                  Welcome back, {user?.name}!
                </h2>

                <StudentDashboardCards
                  total={dashboardData?.totalEnrolledCourses || 0}
                  inProgress={dashboardData?.inProgressCourses || 0}
                  completed={dashboardData?.completedCourses || 0}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Courses */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[18px] font-Poppins font-semibold text-black dark:text-white">
                        Recent Courses
                      </h3>
                      <Link
                        href="/student/my-courses"
                        className="text-[14px] text-[#37a39a] font-semibold hover:underline"
                      >
                        View All
                      </Link>
                    </div>

                    {dashboardData?.recentCourses?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {dashboardData.recentCourses.map((c: any, index: number) => {
                          const p = dashboardData.progressByCourse[c.courseId]?.progressPercentage || 0;
                          return <StudentCourseCard key={index} course={c} progressPercentage={p} />;
                        })}
                      </div>
                    ) : (
                      <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] text-center">
                        <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
                        <Link href="/courses">
                          <button className="mt-4 px-6 py-2 bg-[#37a39a] text-white rounded-lg font-semibold">
                            Browse Courses
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-[18px] font-Poppins font-semibold text-black dark:text-white">
                        Recent Orders
                      </h3>
                      <Link
                        href="/student/orders"
                        className="text-[14px] text-[#37a39a] font-semibold hover:underline"
                      >
                        View All
                      </Link>
                    </div>
                    
                    <StudentOrdersTable orders={dashboardData?.recentOrders || []} />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Protected>
  );
};

export default DashboardPage;

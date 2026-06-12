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

const tabs = ["All", "In Progress", "Completed"] as const;
type Tab = typeof tabs[number];

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 shadow-sm">
    <div className="h-[140px] skeleton" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-4/5 skeleton rounded" />
      <div className="h-3 w-3/5 skeleton rounded" />
      <div className="h-1.5 w-full skeleton rounded-full mt-4" />
      <div className="h-9 w-full skeleton rounded-lg" />
    </div>
  </div>
);

const MyCoursesPage: FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const { data, isLoading } = useGetStudentDashboardQuery(undefined, { refetchOnMountOrArgChange: true });

  const dashboardData = data?.data;
  const enrolledCourses = dashboardData?.enrolledCourses || [];

  const getProgress = (courseId: string) =>
    dashboardData?.progressByCourse?.[courseId]?.progressPercentage || 0;

  const filteredCourses = enrolledCourses.filter((c: any) => {
    const p = getProgress(c.courseId);
    if (activeTab === "Completed") return p >= 100;
    if (activeTab === "In Progress") return p > 0 && p < 100;
    return true;
  });

  const counts = {
    All: enrolledCourses.length,
    "In Progress": enrolledCourses.filter((c: any) => { const p = getProgress(c.courseId); return p > 0 && p < 100; }).length,
    Completed: enrolledCourses.filter((c: any) => getProgress(c.courseId) >= 100).length,
  };

  return (
    <Protected>
      <Heading title={`My Courses - ${user?.name}`} description="Your enrolled courses" keywords="courses, learning" />

      <div className="flex min-h-screen bg-gray-50 dark:bg-darkBg">
        {/* Desktop Sidebar */}
        <div className="hidden 800px:block w-1/5 min-w-[250px] p-4">
          <StudentSidebar user={user} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {openSidebar && (
          <div
            className="fixed inset-0 z-[9999] bg-black/50 800px:hidden animate-fade-in"
            onClick={() => setOpenSidebar(false)}
          >
            <div
              className="w-[260px] h-full bg-white dark:bg-slate-900 animate-slide-in-left"
              onClick={(e) => e.stopPropagation()}
            >
              <StudentSidebar user={user} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col w-full 800px:w-4/5">
          <StudentHeader user={user} setOpenSidebar={setOpenSidebar} />

          <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
            <div className="max-w-[1300px] mx-auto">
              {/* Page header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-[24px] font-Outfit font-bold text-gray-900 dark:text-white">
                    My Courses
                  </h2>
                  <p className="text-sm text-gray-400 dark:text-gray-500 font-Inter mt-0.5">
                    {enrolledCourses.length} course{enrolledCourses.length !== 1 ? "s" : ""} enrolled
                  </p>
                </div>
                {enrolledCourses.length > 0 && (
                  <Link href="/courses">
                    <button className="px-5 py-2 text-sm font-semibold text-primary border border-primary/30 hover:border-primary hover:bg-primary/5 rounded-lg transition-all duration-200 font-Inter">
                      + Explore More Courses
                    </button>
                  </Link>
                )}
              </div>

              {/* Tab bar */}
              {enrolledCourses.length > 0 && (
                <div className="flex gap-1 mb-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-xl p-1 w-fit shadow-sm">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 font-Inter
                        ${activeTab === tab
                          ? "bg-primary text-white shadow-sm"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                    >
                      {tab}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center
                        ${activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"}`}>
                        {counts[tab]}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Loading state */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Courses grid */}
              {!isLoading && filteredCourses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredCourses.map((c: any, index: number) => (
                    <StudentCourseCard key={index} course={c} progressPercentage={getProgress(c.courseId)} />
                  ))}
                </div>
              )}

              {/* No match for filter */}
              {!isLoading && enrolledCourses.length > 0 && filteredCourses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl text-center px-6">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-lg font-Poppins font-semibold text-gray-800 dark:text-white mb-2">
                    No {activeTab.toLowerCase()} courses
                  </h3>
                  <p className="text-sm text-gray-400 font-Inter">
                    Switch to another tab to see your courses.
                  </p>
                </div>
              )}

              {/* Empty enrolled */}
              {!isLoading && enrolledCourses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl text-center px-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-5">
                    <span className="text-4xl">📚</span>
                  </div>
                  <h3 className="text-xl font-Poppins font-bold text-gray-800 dark:text-white mb-2">
                    No courses yet
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-[280px] font-Inter leading-relaxed">
                    Start your learning journey by enrolling in one of our courses.
                  </p>
                  <Link href="/courses">
                    <button className="px-8 py-3 bg-primary hover:bg-primaryDark text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md active:scale-95">
                      Browse Courses
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </Protected>
  );
};

export default MyCoursesPage;

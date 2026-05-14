'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import { useGetTeacherDashboardQuery } from '@/redux/features/teacher/teacherApi'

type Props = {}

const TeacherDashboardPage: FC<Props> = () => {
  const { data, isLoading } = useGetTeacherDashboardQuery({})

  const stats = data?.stats || {}
  const recentOrders = data?.recentOrders || []

  return (
    <TeacherProtected>
      <Heading
        title="Teacher Dashboard - The3S"
        description="Manage your courses, students, and more"
        keywords="teacher, dashboard, LMS, courses"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">
            <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white mb-8">
              Teacher Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 800px:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'My Courses', value: stats.totalCourses ?? 0, color: 'from-blue-500 to-blue-600' },
                { label: 'Total Orders', value: stats.totalOrders ?? 0, color: 'from-emerald-500 to-emerald-600' },
                { label: 'Students', value: stats.totalStudents ?? 0, color: 'from-violet-500 to-violet-600' },
                { label: 'Questions', value: stats.totalQuestions ?? 0, color: 'from-orange-500 to-orange-600' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}
                >
                  {isLoading ? (
                    <div className="h-10 w-16 bg-white/30 rounded animate-pulse mb-2" />
                  ) : (
                    <p className="text-[36px] font-bold">{stat.value}</p>
                  )}
                  <p className="text-[14px] opacity-90 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] p-6 shadow-sm">
              <h2 className="text-[20px] font-semibold font-Poppins text-black dark:text-white mb-5">
                Recent Orders
              </h2>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-[#ffffff1d]">
                        <th className="pb-3 text-gray-600 dark:text-gray-300 font-semibold">Order ID</th>
                        <th className="pb-3 text-gray-600 dark:text-gray-300 font-semibold">Course ID</th>
                        <th className="pb-3 text-gray-600 dark:text-gray-300 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order: any) => (
                        <tr key={order._id} className="border-b border-gray-100 dark:border-[#ffffff0d]">
                          <td className="py-3 text-black dark:text-white font-mono text-xs">{order._id?.slice(0, 10)}...</td>
                          <td className="py-3 text-gray-600 dark:text-gray-300 font-mono text-xs">{order.courseId?.slice(0, 10)}...</td>
                          <td className="py-3 text-gray-600 dark:text-gray-300">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherDashboardPage
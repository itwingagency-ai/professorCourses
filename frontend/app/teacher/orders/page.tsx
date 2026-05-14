'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import { useGetTeacherOrdersQuery } from '@/redux/features/teacher/teacherApi'

type Props = {}

const TeacherOrdersPage: FC<Props> = () => {
  const { data, isLoading } = useGetTeacherOrdersQuery({})
  const orders = data?.orders || []

  return (
    <TeacherProtected>
      <Heading
        title="My Orders - Teacher Dashboard"
        description="View orders for your courses"
        keywords="teacher, orders, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">
            <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white mb-8">
              My Orders
            </h1>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                <p className="text-[18px] text-gray-500 dark:text-gray-400">No orders yet for your courses.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="border-b border-gray-200 dark:border-[#ffffff1d] bg-gray-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Order ID</th>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Course</th>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Student ID</th>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Date</th>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#ffffff0d]">
                      {orders.map((order: any) => (
                        <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                          <td className="px-6 py-4 font-mono text-xs text-gray-700 dark:text-gray-300">
                            {order._id?.slice(0, 12)}...
                          </td>
                          <td className="px-6 py-4 text-black dark:text-white font-medium">
                            {order.courseName || order.courseId?.slice(0, 12) + '...'}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                            {order.userId?.slice(0, 12)}...
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              Enrolled
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherOrdersPage

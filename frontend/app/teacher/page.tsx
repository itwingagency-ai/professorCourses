'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import { useGetTeacherDashboardQuery } from '@/redux/features/teacher/teacherApi'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import {
  HiOutlineAcademicCap,
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineChatAlt2,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
} from 'react-icons/hi'

type Props = {}

const TeacherDashboardPage: FC<Props> = () => {
  const { data, isLoading } = useGetTeacherDashboardQuery({})
  const { user } = useSelector((state: any) => state.auth)

  const stats = data?.stats || {}
  const recentOrders = data?.recentOrders || []
  const courses = data?.courses || []

  const publishedCourses = courses.filter((c: any) => c.status === "published").length
  const pendingCourses = courses.filter((c: any) => c.status === "pending").length
  const rejectedCourses = courses.filter((c: any) => c.status === "rejected").length

  const statCards = [
    {
      label: 'Published',
      value: publishedCourses,
      icon: HiOutlineCheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-100 dark:border-emerald-900/30',
    },
    {
      label: 'Pending Review',
      value: pendingCourses,
      icon: HiOutlineClock,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-100 dark:border-amber-900/30',
    },
    {
      label: 'Rejected',
      value: rejectedCourses,
      icon: HiOutlineExclamationCircle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-100 dark:border-red-900/30',
    },
    {
      label: 'Total Students',
      value: stats.totalStudents ?? 0,
      icon: HiOutlineUsers,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-100 dark:border-blue-900/30',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders ?? 0,
      icon: HiOutlineShoppingBag,
      color: 'text-primary',
      bg: 'bg-primary/10 dark:bg-primary/10',
      border: 'border-primary/20',
    },
    {
      label: 'Questions',
      value: stats.totalQuestions ?? 0,
      icon: HiOutlineChatAlt2,
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      border: 'border-violet-100 dark:border-violet-900/30',
    },
  ]

  return (
    <TeacherProtected>
      <Heading
        title="Teacher Dashboard - The3S"
        description="Manage your courses, students, and more"
        keywords="teacher, dashboard, LMS, courses"
      />
      <div className="flex h-screen bg-gray-50 dark:bg-darkBg">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col min-h-screen">
          <TeacherDashboardHeader />
          <div className="p-6 sm:p-8 flex-1 overflow-y-auto mt-[80px]">
            {/* Welcome Banner */}
            <div className="mb-8 bg-gradient-to-r from-primary via-primary to-primaryLight rounded-2xl p-6 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -right-4 bottom-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-Inter mb-1">Welcome back,</p>
                <h1 className="text-2xl sm:text-3xl font-Outfit font-bold">
                  {user?.name || 'Teacher'} 👋
                </h1>
                <p className="text-white/70 text-sm mt-2 font-Inter">
                  Here&apos;s what&apos;s happening with your courses today.
                </p>
              </div>
              <div className="relative z-10 mt-4 flex gap-3 flex-wrap">
                <Link href="/teacher/create-course">
                  <button className="px-4 py-2 bg-white text-primary rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
                    + Create Course
                  </button>
                </Link>
                <Link href="/teacher/courses">
                  <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-semibold transition-all active:scale-95 border border-white/20">
                    Manage Courses
                  </button>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {statCards.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className={`relative overflow-hidden bg-white dark:bg-slate-900 border ${stat.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-Inter">
                          {stat.label}
                        </p>
                        {isLoading ? (
                          <div className="h-8 w-16 bg-gray-100 dark:bg-slate-700 rounded animate-pulse mt-1" />
                        ) : (
                          <p className="text-3xl font-Outfit font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </p>
                        )}
                      </div>
                      <div className={`${stat.bg} p-2.5 rounded-xl`}>
                        <Icon size={20} className={stat.color} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-white/5">
                <h2 className="text-base font-semibold font-Poppins text-gray-800 dark:text-white flex items-center gap-2">
                  <HiOutlineShoppingBag className="text-primary" />
                  Recent Orders
                </h2>
                <Link href="/teacher/orders" className="text-xs text-primary hover:text-primaryDark font-semibold font-Inter transition-colors">
                  View All →
                </Link>
              </div>

              {isLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-11 skeleton rounded-lg" />
                  ))}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-3">
                    <HiOutlineShoppingBag className="text-2xl text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 font-Poppins">No orders yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 font-Inter">
                    Orders will appear here when students enroll in your courses.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-white/2 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100 dark:border-white/5">
                        <th className="px-6 py-3.5 font-semibold">Order ID</th>
                        <th className="px-6 py-3.5 font-semibold">Course</th>
                        <th className="px-6 py-3.5 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-white/3">
                      {recentOrders.map((order: any) => (
                        <tr key={order._id} className="hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-3.5 text-gray-600 dark:text-gray-400 font-mono text-xs">
                            #{order._id?.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-6 py-3.5 text-gray-600 dark:text-gray-400 font-mono text-xs">
                            {order.courseId?.slice(-8)}...
                          </td>
                          <td className="px-6 py-3.5 text-gray-500 dark:text-gray-400 font-Inter text-xs">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
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
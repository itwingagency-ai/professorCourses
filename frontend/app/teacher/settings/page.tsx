'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import { useSelector } from 'react-redux'
import Link from 'next/link'

type Props = {}

const TeacherSettingsPage: FC<Props> = () => {
  const { user } = useSelector((state: any) => state.auth)

  return (
    <TeacherProtected>
      <Heading
        title="Settings - Teacher Dashboard"
        description="Teacher account settings"
        keywords="teacher, settings, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">
            <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white mb-8">
              Settings
            </h1>

            <div className="max-w-2xl space-y-6">
              {/* Profile card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] shadow-sm p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#37a39a] to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {user?.avatar?.url
                      ? <img src={user.avatar.url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                      : user?.name?.charAt(0).toUpperCase()
                    }
                  </div>
                  <div>
                    <h2 className="text-[22px] font-Poppins font-bold text-black dark:text-white">{user?.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                    <span className="mt-1 inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                    <p className="font-semibold text-black dark:text-white">{user?.name || '—'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p className="font-semibold text-black dark:text-white">{user?.email || '—'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">Role</p>
                    <p className="font-semibold text-black dark:text-white capitalize">{user?.role || '—'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800">
                    <p className="text-gray-500 dark:text-gray-400 mb-1">Account Status</p>
                    <p className="font-semibold text-green-600">Active</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] shadow-sm p-6">
                <h3 className="text-[18px] font-semibold font-Poppins text-black dark:text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link href="/profile">
                    <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-[#37a39a] hover:text-white dark:hover:bg-[#37a39a] transition text-black dark:text-white font-medium">
                      Edit Profile / Change Password
                    </button>
                  </Link>
                  <Link href="/teacher/create-course">
                    <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-[#37a39a] hover:text-white dark:hover:bg-[#37a39a] transition text-black dark:text-white font-medium mt-3">
                      Create New Course
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherSettingsPage

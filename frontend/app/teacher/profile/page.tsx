'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import ProfileInfo from '@/app/components/Profile/ProfileInfo'
import ChangePassword from '@/app/components/Profile/ChangePassword'
import { useSelector } from 'react-redux'

type Props = {}

const TeacherProfilePage: FC<Props> = () => {
  const { user } = useSelector((state: any) => state.auth)
  const [activeTab, setActiveTab] = useState(1)

  return (
    <TeacherProtected>
      <Heading
        title="Teacher Profile - The3S"
        description="Manage your teacher profile"
        keywords="teacher, profile, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">
            <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white mb-8">
              My Profile
            </h1>

            <div className="flex gap-8">
              {/* Profile Tabs */}
              <div className="w-[250px] shrink-0 space-y-2">
                <button
                  onClick={() => setActiveTab(1)}
                  className={`w-full text-left px-6 py-4 rounded-xl font-semibold transition ${
                    activeTab === 1
                      ? 'bg-[#37a39a]/10 text-[#37a39a] border border-[#37a39a]/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab(2)}
                  className={`w-full text-left px-6 py-4 rounded-xl font-semibold transition ${
                    activeTab === 2
                      ? 'bg-[#37a39a]/10 text-[#37a39a] border border-[#37a39a]/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  Change Password
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 max-w-[800px] bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] p-8">
                {activeTab === 1 && (
                  <div className="w-full">
                    <ProfileInfo avatar={user?.avatar?.url} user={user} />
                  </div>
                )}
                {activeTab === 2 && (
                  <div className="w-full">
                    <ChangePassword />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherProfilePage

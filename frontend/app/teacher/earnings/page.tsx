'use client'
import React, { FC } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'

type Props = {}

const TeacherEarningsPage: FC<Props> = () => {
  return (
    <TeacherProtected>
      <Heading
        title="Earnings - Teacher Dashboard"
        description="View your earnings"
        keywords="teacher, earnings, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] p-10 max-w-[500px]">
              <div className="text-5xl mb-4">💰</div>
              <h2 className="text-[24px] font-Poppins font-[700] text-black dark:text-white mb-2">
                Earnings & Payouts
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Payment processing and earnings reports are currently under development and will be available soon. Keep creating great content!
              </p>
              <div className="mt-6 inline-block px-4 py-1.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-semibold text-sm rounded-full">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherEarningsPage

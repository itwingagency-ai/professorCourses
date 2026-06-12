'use client'
import React, { FC } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'

type Props = {}

const TeacherReviewsPage: FC<Props> = () => {
  return (
    <TeacherProtected>
      <Heading
        title="Reviews - Teacher Dashboard"
        description="View your reviews"
        keywords="teacher, reviews, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] p-10 max-w-[500px]">
              <div className="text-5xl mb-4">⭐</div>
              <h2 className="text-[24px] font-Poppins font-[700] text-black dark:text-white mb-2">
                Course Reviews
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                The centralized reviews management dashboard is currently under development. You will soon be able to reply to student reviews from here.
              </p>
              <div className="mt-6 inline-block px-4 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-semibold text-sm rounded-full">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherReviewsPage

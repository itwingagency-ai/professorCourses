'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import EditCourse from '@/app/components/Teacher/Course/EditCourse'

type Props = {}

const EditCoursePage: FC<Props> = () => {
  const params = useParams()
  const courseId = params?.id as string

  return (
    <TeacherProtected>
      <Heading
        title="Edit Course - Teacher Dashboard"
        description="Edit your course details"
        keywords="teacher, edit course, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="flex-1 overflow-y-auto">
             <EditCourse id={courseId} />
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default EditCoursePage

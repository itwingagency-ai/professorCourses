/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import React, { FC } from 'react'
import TeacherSideBar from "../../components/Teacher/sidebar/TeacherSideBar";
import CreateCourse from "../../components/Teacher/Course/CreateCourse";
import Heading from '../../../app/utils/Heading';
import TeacherDashboardHeader from '../../../app/components/Teacher/TeacherDashboardHeader';
import TeacherProtected from '../../hooks/teacherProtected';

type Props = {}

const page: FC<Props> = () => {
  return (
    <TeacherProtected>
      <div>
        <Heading
          title="Create Course - Teacher Dashboard"
          description="Create a new course for your students"
          keywords="teacher, create course, LMS"
        />
        <div className="flex">
          <div className="1500px:w-[16%] w-1/5">
            <TeacherSideBar />
          </div>
          <div className="w-[85%]">
            <TeacherDashboardHeader />
            <CreateCourse />
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default page;
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import React, { FC } from 'react'
import TeacherSideBar from "../../components/Teacher/sidebar/TeacherSideBar";
import CreateCourse from "../../components/Teacher/Course/CreateCourse";
import Heading from '../../../app/utils/Heading';
import TeacherDashboardHeader from '../../../app/components/Teacher/TeacherDashboardHeader';
type Props = {}

const page: FC<Props> = () => {
  return (
    <div>
        <Heading
          title=" The3S - Admin"
          description="Your trusted partner for digital transformation"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className=" flex ">
          <div className="1500px:w-[16%] w-1/5">
            <TeacherSideBar />
          </div>
          <div className=" w-[85%] ">
            <TeacherDashboardHeader />
            <CreateCourse/>
          </div>
        </div>
    </div>
  )
}

export default page;
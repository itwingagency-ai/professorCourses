/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import React, { FC } from 'react'
import Heading from '../utils/Heading'
import TeacherSideBar from "../components/Teacher/sidebar/TeacherSideBar";
import TeacherProtected from '../hooks/teacherProtected';
import TeacherDashboardHero from "../components/Teacher/TeacherDashboardHero";
type Props = {}

const page: FC<Props> = () => {
  return (
    <div>
      <TeacherProtected>
        <Heading
          title=" The3S - Admin"
          description="Your trusted partner for digital transformation"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className=" flex h-[200vh]">
          <div className="1500px:w-[16%] w-1/5">
            <TeacherSideBar />
          </div>
          <div className=" w-[85%] ">
            <TeacherDashboardHero/>
          </div>
        </div>
      </TeacherProtected>
    </div>
  )
}

export default page;
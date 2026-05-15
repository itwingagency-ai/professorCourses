/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import React, { FC } from 'react'

import AdminSideBar from "../../components/Admin/sidebar/AdminSideBar";
import CreateCourse from "../../components/Admin/Course/CreateCourse";
import DashboardHeader from '../../../app/components/Admin/DashboardHeader';
import Heading from '../../../app/utils/Heading';
import AdminProtected from '../../hooks/adminProtected';
type Props = {}

const page: FC<Props> = () => {
  return (
    <div>
      <AdminProtected>
        <Heading
          title=" The3S - Admin"
          description="Your trusted partner for digital transformation"
          keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className=" flex min-h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <AdminSideBar />
          </div>
          <div className=" w-[85%] ">
            <DashboardHeader />
            <CreateCourse/>
          </div>
        </div>
      </AdminProtected>
    </div>
  )
}

export default page;
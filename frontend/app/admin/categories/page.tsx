/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React, { FC } from 'react'
import AdminSideBar from "../../components/Admin/sidebar/AdminSideBar";
import EditCategories from "../../components/Admin/Customization/EditCategories";
type Props = {}

const page: FC<Props> = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title=" The3S - Admin"
                    description="Your trusted partner for digital transformation"
                    keywords="Programming, MERN, Redux, Machine Learning" />
                <div className="flex min-h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSideBar />
                    </div>
                    <div className=" w-[85%] ">
                        <DashboardHero />
                        <EditCategories /> 
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
}

export default page;
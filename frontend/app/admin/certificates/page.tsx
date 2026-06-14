'use client'
import DashboardHero from '@/app/components/Admin/DashboardHero'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React, { FC } from 'react'
import AdminSideBar from "../../components/Admin/sidebar/AdminSideBar";
import AllCertificates from "../../components/Admin/Academic/AllCertificates";

type Props = {}

const Page: FC<Props> = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title=" The3S - Admin Certificates"
                    description="Admin Academic Management"
                    keywords="Certificates" />
                <div className="flex h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSideBar />
                    </div>
                    <div className="w-[85%]">
                        <DashboardHero />
                        <AllCertificates />
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
}

export default Page;

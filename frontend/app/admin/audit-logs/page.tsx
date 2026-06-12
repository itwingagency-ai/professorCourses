'use client'
import AdminProtected from '@/app/hooks/adminProtected'
import Heading from '@/app/utils/Heading'
import React from 'react'
import AdminSideBar from '../../components/Admin/sidebar/AdminSideBar'
import DashboardHero from '../../components/Admin/DashboardHero'
import AdminAuditLogs from '@/app/components/Admin/AuditLogs/AdminAuditLogs'

const Page = () => {
    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Audit Logs - Admin"
                    description="View system audit logs"
                    keywords="Admin, LMS, Logs"
                />
                <div className="flex h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSideBar />
                    </div>
                    <div className="w-[85%]">
                        <DashboardHero />
                        <AdminAuditLogs />
                    </div>
                </div>
            </AdminProtected>
        </div>
    )
}

export default Page

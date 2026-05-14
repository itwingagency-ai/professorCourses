'use client';
import React from 'react';
import AdminSideBar from "@/app/components/Admin/sidebar/AdminSideBar";
import AdminProtected from '@/app/hooks/adminProtected';
import Heading from '@/app/utils/Heading';
import DashboardHeader from '@/app/components/Admin/DashboardHeader';
import { useGetNotificationsQuery, useUpdateNotificationStatusMutation } from '@/redux/features/notifications/notificationsApi';
import Loader from '@/app/components/Loader/Loader';
import { styles } from '@/app/styles/style';
import { format } from 'timeago.js';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
    const { data, isLoading, refetch } = useGetNotificationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [updateNotificationStatus] = useUpdateNotificationStatusMutation();

    const handleUpdateStatus = async (id: string) => {
        try {
            await updateNotificationStatus(id).unwrap();
            toast.success("Notification marked as read");
            refetch();
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to update notification");
        }
    };

    const notifications = data?.notifications || [];

    return (
        <div>
            <AdminProtected>
                <Heading
                    title="Admin - Notifications"
                    description="View and manage admin notifications"
                    keywords="Admin, Notifications, LMS"
                />
                <div className="flex min-h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSideBar />
                    </div>
                    <div className="w-[85%] p-8">
                        <DashboardHeader open={false} setOpen={() => {}} />
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <div className="mt-[100px]">
                                <h1 className={`${styles.title} text-left mb-8`}>Notification Center</h1>
                                <div className="space-y-4">
                                    {notifications.length === 0 ? (
                                        <p className="dark:text-white text-center py-10">No notifications found</p>
                                    ) : (
                                        notifications.map((item: any) => (
                                            <div 
                                                key={item._id} 
                                                className={`p-6 rounded-lg shadow transition-all ${
                                                    item.status === 'unread' 
                                                    ? 'bg-blue-50 dark:bg-[#1a285a] border-l-4 border-blue-500' 
                                                    : 'bg-white dark:bg-[#111C43] border-l-4 border-gray-300 dark:border-gray-600'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-lg font-bold dark:text-white">{item.title}</h3>
                                                    {item.status === 'unread' && (
                                                        <button 
                                                            onClick={() => handleUpdateStatus(item._id)}
                                                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.message}</p>
                                                <div className="flex justify-between items-center text-xs text-gray-400">
                                                    <span>Status: <span className="capitalize">{item.status}</span></span>
                                                    <span>{format(item.createdAt)}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default NotificationsPage;

'use client';
import React, { FC } from 'react';
import AdminSideBar from "../../../components/Admin/sidebar/AdminSideBar";
import AdminProtected from '../../../hooks/adminProtected';
import Heading from '../../../utils/Heading';
import { useParams } from 'next/navigation';
import { useGetAdminUserByIdQuery, useGetAdminUserOrdersQuery } from '@/redux/features/admin/adminApi';
import { useUpdateUserRoleMutation } from '@/redux/features/user/userApi';
import Loader from '../../../components/Loader/Loader';
import { styles } from '@/app/styles/style';
import { format } from 'timeago.js';
import toast from 'react-hot-toast';

const UserDetailPage = () => {
    const params = useParams();
    const id = params?.id as string;

    const { data: userData, isLoading: userLoading, refetch } = useGetAdminUserByIdQuery(id);
    const { data: ordersData, isLoading: ordersLoading } = useGetAdminUserOrdersQuery(id);
    const [updateUserRole, { isLoading: roleLoading }] = useUpdateUserRoleMutation();

    const user = userData?.user;
    const orders = ordersData?.orders;

    const handleRoleUpdate = async (newRole: string) => {
        try {
            await updateUserRole({ id, role: newRole }).unwrap();
            toast.success("Role updated successfully");
            refetch();
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to update role");
        }
    };

    return (
        <div>
            <AdminProtected>
                <Heading
                    title={`Admin - User Details`}
                    description="User detailed information and history"
                    keywords="Admin, User Details, LMS"
                />
                <div className="flex min-h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSideBar />
                    </div>
                    <div className="w-[85%] p-8">
                        {userLoading ? (
                            <Loader />
                        ) : (
                            <div className="mt-[80px]">
                                <h1 className={`${styles.title} text-left mb-8`}>User Details</h1>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-[#111C43] p-6 rounded-lg shadow-lg">
                                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Profile Information</h2>
                                        <div className="space-y-3 dark:text-gray-300">
                                            <p><span className="font-bold">Name:</span> {user?.name}</p>
                                            <p><span className="font-bold">Email:</span> {user?.email}</p>
                                            <div className="flex items-center gap-4">
                                                <p><span className="font-bold">Role:</span> {user?.role}</p>
                                                <div className="flex gap-2">
                                                    {user?.role !== "admin" && (
                                                        <button 
                                                            onClick={() => handleRoleUpdate("admin")}
                                                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
                                                            disabled={roleLoading}
                                                        >
                                                            Make Admin
                                                        </button>
                                                    )}
                                                    {user?.role !== "student" && (
                                                        <button 
                                                            onClick={() => handleRoleUpdate("student")}
                                                            className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded disabled:opacity-50"
                                                            disabled={roleLoading}
                                                        >
                                                            Make Student
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p><span className="font-bold">Joined:</span> {format(user?.createdAt)}</p>
                                            <p><span className="font-bold">Verified:</span> {user?.isVerified ? "Yes" : "No"}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-[#111C43] p-6 rounded-lg shadow-lg">
                                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Quick Stats</h2>
                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">
                                                <p className="text-2xl font-bold dark:text-white">{user?.courses?.length || 0}</p>
                                                <p className="text-sm dark:text-gray-300">Courses</p>
                                            </div>
                                            <div className="p-4 bg-green-100 dark:bg-green-900 rounded">
                                                <p className="text-2xl font-bold dark:text-white">{orders?.length || 0}</p>
                                                <p className="text-sm dark:text-gray-300">Orders</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Order History</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full bg-white dark:bg-[#111C43] rounded-lg shadow">
                                            <thead>
                                                <tr className="border-b dark:border-gray-700">
                                                    <th className="p-4 text-left dark:text-white">Order ID</th>
                                                    <th className="p-4 text-left dark:text-white">Course ID</th>
                                                    <th className="p-4 text-left dark:text-white">Price</th>
                                                    <th className="p-4 text-left dark:text-white">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ordersLoading ? (
                                                    <tr><td colSpan={4} className="p-4 text-center dark:text-gray-300">Loading orders...</td></tr>
                                                ) : orders?.length === 0 ? (
                                                    <tr><td colSpan={4} className="p-4 text-center dark:text-gray-300">No orders found</td></tr>
                                                ) : (
                                                    orders?.map((order: any) => (
                                                        <tr key={order._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1a285a]">
                                                            <td className="p-4 dark:text-gray-300 text-sm">{order._id}</td>
                                                            <td className="p-4 dark:text-gray-300">{order.courseId}</td>
                                                            <td className="p-4 dark:text-gray-300">${(order.payment_info?.amount / 100) || 0}</td>
                                                            <td className="p-4 dark:text-gray-300">{format(order.createdAt)}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default UserDetailPage;

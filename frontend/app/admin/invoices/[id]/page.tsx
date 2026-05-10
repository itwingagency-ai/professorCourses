'use client';
import React from 'react';
import AdminSideBar from "../../../components/Admin/sidebar/AdminSideBar";
import AdminProtected from '../../../hooks/adminProtected';
import Heading from '../../../utils/Heading';
import { useParams } from 'next/navigation';
import { useGetAdminOrderByIdQuery } from '@/redux/features/admin/adminApi';
import Loader from '../../../components/Loader/Loader';
import { styles } from '@/app/styles/style';
import { format } from 'timeago.js';

const OrderDetailPage = () => {
    const params = useParams();
    const id = params?.id as string;

    const { data, isLoading } = useGetAdminOrderByIdQuery(id);
    const order = data?.order;
    const user = data?.user;
    const course = data?.course;

    return (
        <div>
            <AdminProtected>
                <Heading
                    title={`Admin - Order Details`}
                    description="Order detailed information and invoice"
                    keywords="Admin, Order, Details, Invoice"
                />
                <div className="flex min-h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSideBar />
                    </div>
                    <div className="w-[85%] p-8">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <div className="mt-[80px]">
                                <h1 className={`${styles.title} text-left mb-8`}>Order Invoice</h1>
                                
                                <div className="bg-white dark:bg-[#111C43] p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
                                    <div className="flex justify-between border-b dark:border-gray-700 pb-8 mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold dark:text-white">INVOICE</h2>
                                            <p className="text-gray-500">#{order?._id}</p>
                                        </div>
                                        <div className="text-right">
                                            <h3 className="font-bold dark:text-white text-xl">The3S Consultant</h3>
                                            <p className="text-gray-500">Order Date: {format(order?.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-12 mb-12">
                                        <div>
                                            <h4 className="font-bold mb-4 dark:text-gray-300">BILL TO:</h4>
                                            <div className="dark:text-white">
                                                <p className="font-bold">{user?.name}</p>
                                                <p>{user?.email}</p>
                                                <p>User ID: {user?._id}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-4 dark:text-gray-300">PAYMENT INFO:</h4>
                                            <div className="dark:text-white">
                                                <p>Method: Stripe</p>
                                                <p>Status: Paid</p>
                                                <p>Transaction ID: {order?.payment_info?.id || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <table className="w-full mb-12">
                                        <thead>
                                            <tr className="border-b dark:border-gray-700 text-left">
                                                <th className="py-4 dark:text-white">COURSE DESCRIPTION</th>
                                                <th className="py-4 text-right dark:text-white">TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b dark:border-gray-700">
                                                <td className="py-4 dark:text-white">
                                                    <p className="font-bold">{course?.name}</p>
                                                    <p className="text-sm text-gray-500">{course?._id}</p>
                                                </td>
                                                <td className="py-4 text-right dark:text-white font-bold">
                                                    ${(order?.payment_info?.amount / 100) || course?.price}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="flex justify-end">
                                        <div className="w-64">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-gray-500">Subtotal:</span>
                                                <span className="dark:text-white font-bold">${(order?.payment_info?.amount / 100) || course?.price}</span>
                                            </div>
                                            <div className="flex justify-between border-t dark:border-gray-700 pt-2 mt-2">
                                                <span className="text-xl font-bold dark:text-white">Total:</span>
                                                <span className="text-xl font-bold dark:text-white">${(order?.payment_info?.amount / 100) || course?.price}</span>
                                            </div>
                                        </div>
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

export default OrderDetailPage;

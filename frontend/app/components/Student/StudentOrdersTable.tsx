/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import { format } from "timeago.js";

type Props = {
  orders: any[];
};

const StudentOrdersTable: FC<Props> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] rounded-2xl shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-[#ffffff1d]">
            <th className="px-6 py-4 font-semibold">Course Name</th>
            <th className="px-6 py-4 font-semibold">Price</th>
            <th className="px-6 py-4 font-semibold">Payment Type</th>
            <th className="px-6 py-4 font-semibold">Date</th>
            <th className="px-6 py-4 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {orders.map((order, index) => (
            <tr
              key={order._id || index}
              className="border-b border-gray-200 dark:border-[#ffffff1d] text-black dark:text-white"
            >
              <td className="px-6 py-4 font-medium">{order.courseName}</td>
              <td className="px-6 py-4">${order.amount}</td>
              <td className="px-6 py-4 capitalize">{order.paymentType}</td>
              <td className="px-6 py-4">{format(order.createdAt)}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentOrdersTable;

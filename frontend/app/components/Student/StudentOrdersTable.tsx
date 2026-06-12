/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import { format } from "timeago.js";
import { AiOutlineInbox } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Link from "next/link";

type Props = {
  orders: any[];
};

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  pending: { label: "Pending", className: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
  failed: { label: "Failed", className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" },
  free: { label: "Free", className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
};

const StudentOrdersTable: FC<Props> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm text-center px-6">
        <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <AiOutlineInbox size={32} className="text-gray-300 dark:text-gray-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-1.5 font-Poppins">
          No orders yet
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-[260px] font-Inter leading-relaxed">
          Your order history will appear here once you enroll in courses.
        </p>
        <Link href="/courses">
          <button className="mt-5 px-5 py-2 bg-primary hover:bg-primaryDark text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95">
            Browse Courses
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-50 dark:border-white/5">
        <HiOutlineShoppingBag className="text-primary text-lg" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 font-Poppins">
          Order History
        </h3>
        <span className="ml-auto text-xs text-gray-400 font-Inter">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table - Desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-white/2 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100 dark:border-white/5">
              <th className="px-5 py-3 font-semibold">Course</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold">Type</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/3">
            {orders.map((order, index) => {
              const status = order.status?.toLowerCase() || (order.amount === 0 ? "free" : "paid");
              const cfg = statusConfig[status] || statusConfig.paid;
              return (
                <tr
                  key={order._id || index}
                  className="hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors duration-150"
                >
                  <td className="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-200 font-Inter max-w-[200px]">
                    <span className="truncate block">{order.courseName || "—"}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-400 font-Inter font-semibold">
                    {order.amount === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Free</span>
                    ) : (
                      `$${order.amount}`
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 capitalize font-Inter text-xs">
                    {order.paymentType || "enrollment"}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400 font-Inter text-xs">
                    {format(order.createdAt)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden divide-y divide-gray-50 dark:divide-white/5">
        {orders.map((order, index) => {
          const status = order.status?.toLowerCase() || (order.amount === 0 ? "free" : "paid");
          const cfg = statusConfig[status] || statusConfig.paid;
          return (
            <div key={order._id || index} className="px-5 py-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate font-Poppins">
                  {order.courseName || "Course"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 font-Inter">{format(order.createdAt)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
                  {cfg.label}
                </span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {order.amount === 0 ? "Free" : `$${order.amount}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentOrdersTable;

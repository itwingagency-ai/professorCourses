/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import Protected from "../../hooks/useprotected";
import Heading from "../../utils/Heading";
import StudentSidebar from "../../components/Student/StudentSidebar";
import StudentHeader from "../../components/Student/StudentHeader";
import StudentOrdersTable from "../../components/Student/StudentOrdersTable";
import { useGetStudentOrdersQuery } from "@/redux/features/student/studentApi";
import Loader from "../../components/Loader/Loader";

const OrdersPage: FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [openSidebar, setOpenSidebar] = useState(false);
  const { data, isLoading } = useGetStudentOrdersQuery(undefined, { refetchOnMountOrArgChange: true });

  return (
    <Protected>
      <Heading title={`My Orders - ${user?.name}`} description="Student orders" keywords="orders" />
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="hidden 800px:block w-1/5 min-w-[250px] p-4">
          <StudentSidebar user={user} />
        </div>
        {openSidebar && (
          <div className="fixed inset-0 z-[9999] bg-black/50 800px:hidden" onClick={() => setOpenSidebar(false)}>
            <div className="w-[250px] h-full bg-white dark:bg-slate-900" onClick={(e) => e.stopPropagation()}>
              <StudentSidebar user={user} />
            </div>
          </div>
        )}
        <div className="flex-1 flex flex-col w-full 800px:w-4/5">
          <StudentHeader user={user} setOpenSidebar={setOpenSidebar} />
          <main className="p-4 sm:p-8 flex-1 overflow-y-auto">
            {isLoading ? <Loader /> : (
              <div className="max-w-[1200px] mx-auto">
                <h2 className="text-[24px] font-Poppins font-semibold text-black dark:text-white mb-6">Order History</h2>
                <StudentOrdersTable orders={data?.orders || []} />
              </div>
            )}
          </main>
        </div>
      </div>
    </Protected>
  );
};
export default OrdersPage;

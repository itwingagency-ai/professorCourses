import React, { FC } from "react";
import { AiOutlineBook, AiOutlineCheckCircle, AiOutlinePlayCircle } from "react-icons/ai";

type Props = {
  total: number;
  inProgress: number;
  completed: number;
};

const StudentDashboardCards: FC<Props> = ({ total, inProgress, completed }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-6 rounded-2xl shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <AiOutlineBook size={24} />
        </div>
        <div>
          <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Enrolled</h4>
          <p className="text-2xl font-bold text-black dark:text-white">{total}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-6 rounded-2xl shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
          <AiOutlinePlayCircle size={24} />
        </div>
        <div>
          <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">In Progress</h4>
          <p className="text-2xl font-bold text-black dark:text-white">{inProgress}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-6 rounded-2xl shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
          <AiOutlineCheckCircle size={24} />
        </div>
        <div>
          <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed</h4>
          <p className="text-2xl font-bold text-black dark:text-white">{completed}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardCards;

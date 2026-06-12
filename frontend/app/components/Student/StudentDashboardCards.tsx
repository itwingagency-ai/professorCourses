import React, { FC } from "react";
import { AiOutlineBook, AiOutlineCheckCircle, AiOutlinePlayCircle } from "react-icons/ai";
import { HiTrendingUp } from "react-icons/hi";

type Props = {
  total: number;
  inProgress: number;
  completed: number;
};

const cards = [
  {
    key: "total" as const,
    label: "Total Enrolled",
    icon: AiOutlineBook,
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-500 dark:text-blue-400",
    accent: "from-blue-500/10 to-transparent",
    borderColor: "border-blue-100 dark:border-blue-900/30",
  },
  {
    key: "inProgress" as const,
    label: "In Progress",
    icon: AiOutlinePlayCircle,
    iconBg: "bg-amber-50 dark:bg-amber-900/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    accent: "from-amber-500/10 to-transparent",
    borderColor: "border-amber-100 dark:border-amber-900/30",
  },
  {
    key: "completed" as const,
    label: "Completed",
    icon: AiOutlineCheckCircle,
    iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
    iconColor: "text-emerald-500 dark:text-emerald-400",
    accent: "from-emerald-500/10 to-transparent",
    borderColor: "border-emerald-100 dark:border-emerald-900/30",
  },
];

const StudentDashboardCards: FC<Props> = ({ total, inProgress, completed }) => {
  const values = { total, inProgress, completed };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {cards.map(({ key, label, icon: Icon, iconBg, iconColor, accent, borderColor }) => (
        <div
          key={key}
          className={`relative overflow-hidden bg-white dark:bg-slate-900 border ${borderColor} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300`}
        >
          {/* Subtle gradient accent */}
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${accent} rounded-full -translate-y-6 translate-x-6 pointer-events-none`} />

          <div className="flex items-start justify-between relative">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 font-Inter">
                {label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white font-Outfit">
                {values[key]}
              </p>
            </div>
            <div className={`${iconBg} p-3 rounded-xl`}>
              <Icon size={22} className={iconColor} />
            </div>
          </div>

          {key === "inProgress" && total > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-Inter">
              <HiTrendingUp className="text-amber-500" />
              <span>{Math.round((inProgress / total) * 100)}% of courses active</span>
            </div>
          )}
          {key === "completed" && total > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-Inter">
              <HiTrendingUp className="text-emerald-500" />
              <span>{Math.round((completed / total) * 100)}% completion rate</span>
            </div>
          )}
          {key === "total" && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-Inter">
              <HiTrendingUp className="text-blue-500" />
              <span>Active learner</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentDashboardCards;

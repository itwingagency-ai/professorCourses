/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import SafeCourseImage from "../SafeCourseImage";
import Link from "next/link";
import { AiOutlinePlayCircle, AiOutlineCheckCircle } from "react-icons/ai";

type Props = {
  course: any;
  progressPercentage?: number;
};

const StudentCourseCard: FC<Props> = ({ course, progressPercentage = 0 }) => {
  const courseId = course?.courseId || course?._id;
  const thumbnail = course?.thumbnail?.url || course?.thumbnail || "/assests/banner-img-1.png";
  const title = course?.name || course?.title || "Untitled Course";
  const isCompleted = progressPercentage >= 100;
  const hasStarted = progressPercentage > 0;

  return (
    <div className="group w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative w-full h-[140px] overflow-hidden">
        <SafeCourseImage
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
            <div className="bg-emerald-500 text-white rounded-full p-2">
              <AiOutlineCheckCircle size={24} />
            </div>
          </div>
        )}
        {/* Progress badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full
            ${isCompleted
              ? "bg-emerald-500 text-white"
              : hasStarted
              ? "bg-primary text-white"
              : "bg-gray-800/70 text-white"
            }`}
          >
            {isCompleted ? "✓ Done" : hasStarted ? `${progressPercentage}%` : "New"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-Poppins font-semibold text-[14px] text-gray-900 dark:text-white line-clamp-2 mb-3 leading-snug">
          {title}
        </h3>

        <div className="mt-auto">
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-Inter">Progress</span>
              <span className={`text-xs font-semibold font-Inter ${isCompleted ? "text-emerald-500" : "text-primary"}`}>
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-primary to-primaryLight"}`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* CTA Button */}
          <Link href={`/course-access/${courseId}`} className="block">
            <button className={`w-full py-2.5 rounded-lg font-semibold text-[13px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-95
              ${isCompleted
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                : "bg-primary hover:bg-primaryDark text-white shadow-sm hover:shadow-md"
              }`}
            >
              <AiOutlinePlayCircle size={16} />
              {isCompleted ? "Review Course" : hasStarted ? "Continue Learning" : "Start Course"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseCard;

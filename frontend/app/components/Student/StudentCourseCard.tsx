/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import SafeCourseImage from "../SafeCourseImage";
import Link from "next/link";
import StudentProgressBar from "./StudentProgressBar";

type Props = {
  course: any;
  progressPercentage?: number;
};

const StudentCourseCard: FC<Props> = ({ course, progressPercentage = 0 }) => {
  const courseId = course?.courseId || course?._id;
  const thumbnail = course?.thumbnail?.url || course?.thumbnail || "/assests/banner-img-1.png";
  const title = course?.name || course?.title || "Untitled Course";

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
      <div className="relative w-full h-[150px]">
        <SafeCourseImage 
          src={thumbnail} 
          alt={title} 
          className="h-full w-full object-cover" 
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-Poppins font-semibold text-[16px] text-black dark:text-white line-clamp-2 mb-4">
          {title}
        </h3>

        <div className="mt-auto">
          <StudentProgressBar percentage={progressPercentage} />

          <Link href={`/course-access/${courseId}`} className="block mt-4">
            <button className="w-full py-2 bg-[#37a39a] hover:bg-[#2b857d] text-white rounded-lg font-semibold text-[14px] transition">
              {progressPercentage === 0 ? "Start Course" : "Continue Learning"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentCourseCard;

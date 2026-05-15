"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo } from "react";
import Link from "next/link";

const fallbackImage = "/assests/banner-img-1.png";

type Props = {
  user: any;
};

const getCourseId = (item: any): string => {
  return (
    item?.courseId?._id ||
    item?.courseId ||
    item?._id ||
    item?.id ||
    ""
  ).toString();
};

const getCourseTitle = (item: any): string => {
  return (
    item?.name ||
    item?.title ||
    item?.courseId?.name ||
    item?.courseId?.title ||
    "Enrolled Course"
  );
};

const getCourseImage = (item: any): string => {
  return (
    item?.thumbnail?.url ||
    item?.thumbnail?.secure_url ||
    item?.thumbnail ||
    item?.courseId?.thumbnail?.url ||
    item?.courseId?.thumbnail?.secure_url ||
    item?.courseId?.thumbnail ||
    fallbackImage
  );
};

const MyCourses: FC<Props> = ({ user }) => {
  const courses = useMemo(() => {
    const rawCourses = Array.isArray(user?.courses) ? user.courses : [];

    const normalized = rawCourses
      .map((item: any) => {
        const id = getCourseId(item);

        if (!id) {
          return null;
        }

        return {
          id,
          title: getCourseTitle(item),
          image: getCourseImage(item),
          purchasedAt: item?.purchasedAt || item?.createdAt,
        };
      })
      .filter(Boolean) as any[];

    const uniqueMap = new Map<string, any>();

    normalized.forEach((course) => {
      if (!uniqueMap.has(course.id)) {
        uniqueMap.set(course.id, course);
      }
    });

    return Array.from(uniqueMap.values());
  }, [user]);

  return (
    <div className="w-full px-4 800px:px-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white">
          My Courses
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Your enrolled courses are listed here.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
          <h2 className="text-[24px] font-semibold text-black dark:text-white">
            No enrolled courses yet
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-3">
            Browse courses and enroll to start learning.
          </p>

          <Link href="/courses">
            <button className="mt-6 px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold">
              Browse Courses
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 1100px:grid-cols-2 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col 800px:flex-row gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full 800px:w-[160px] h-[140px] object-cover rounded-lg"
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                }}
              />

              <div className="flex-1">
                <h2 className="text-[18px] font-Poppins font-[600] text-black dark:text-white line-clamp-2">
                  {course.title}
                </h2>

                {course.purchasedAt && (
                  <p className="text-[13px] text-gray-500 dark:text-gray-300 mt-2">
                    Enrolled: {new Date(course.purchasedAt).toLocaleDateString()}
                  </p>
                )}

                <div className="flex flex-col 800px:flex-row gap-3 mt-4">
                  <Link href={`/course-access/${course.id}`}>
                    <button className="px-5 py-2 rounded-lg bg-[#37a39a] text-white text-[14px] font-semibold">
                      Start Learning
                    </button>
                  </Link>

                  <Link href={`/course/${course.id}`}>
                    <button className="px-5 py-2 rounded-lg border border-[#37a39a] text-[#37a39a] text-[14px] font-semibold">
                      Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/student/my-courses">
          <button className="px-7 py-3 rounded-lg border border-[#37a39a] text-[#37a39a] font-semibold hover:bg-[#37a39a1a] transition">
            Open Full My Courses Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MyCourses;

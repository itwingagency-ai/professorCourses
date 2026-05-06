"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Protected from "../hooks/useprotected";
import Heading from "../utils/Heading";

const fallbackImage = "/assests/banner-img-1.png";

type NormalizedMyCourse = {
  id: string;
  title: string;
  image: string;
  category?: string;
  level?: string;
  purchasedAt?: string | Date;
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

const normalizeMyCourse = (item: any): NormalizedMyCourse | null => {
  const id = getCourseId(item);

  if (!id) {
    return null;
  }

  return {
    id,
    title: getCourseTitle(item),
    image: getCourseImage(item),
    category: item?.category || item?.categories || item?.courseId?.category || item?.courseId?.categories,
    level: item?.level || item?.courseId?.level,
    purchasedAt: item?.purchasedAt || item?.createdAt || item?.courseId?.purchasedAt,
  };
};

const MyCoursesPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [search, setSearch] = useState("");

  const { user, authChecked } = useSelector((state: any) => state.auth);

  const courses = useMemo(() => {
    const rawCourses = Array.isArray(user?.courses) ? user.courses : [];

    const normalized = rawCourses
      .map(normalizeMyCourse)
      .filter(Boolean) as NormalizedMyCourse[];

    const uniqueMap = new Map<string, NormalizedMyCourse>();

    normalized.forEach((course) => {
      if (!uniqueMap.has(course.id)) {
        uniqueMap.set(course.id, course);
      }
    });

    return Array.from(uniqueMap.values());
  }, [user]);

  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return courses;
    }

    return courses.filter((course) => {
      return `${course.title} ${course.category || ""} ${course.level || ""}`
        .toLowerCase()
        .includes(keyword);
    });
  }, [courses, search]);

  return (
    <Protected>
      <div>
        <Heading
          title="My Courses - 3S Consultant"
          description="Your enrolled courses"
          keywords="my courses, enrolled courses, LMS"
        />

        <Header
          open={open}
          setOpen={setOpen}
          activeItem={1}
          setRoute={setRoute}
          route={route}
        />

        <main className="w-[92%] 800px:w-[85%] mx-auto py-12">
          <section className="mb-10">
            <div className="flex flex-col 800px:flex-row 800px:items-end 800px:justify-between gap-5">
              <div>
                <p className="text-[#37a39a] font-Poppins font-[600] mb-2">
                  Student Dashboard
                </p>

                <h1 className="text-[32px] 800px:text-[44px] font-Poppins font-[700] text-black dark:text-white leading-tight">
                  My Courses
                </h1>

                <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-[650px] leading-7">
                  Continue learning from your enrolled courses. Your purchased or
                  enrolled courses will appear here.
                </p>
              </div>

              <Link href="/courses">
                <button className="px-7 py-3 rounded-lg bg-[#37a39a] text-white font-semibold hover:opacity-90 transition">
                  Browse More Courses
                </button>
              </Link>
            </div>
          </section>

          <section className="mb-8 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-4 800px:p-6">
            <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-4">
              <input
                type="text"
                placeholder="Search your enrolled courses..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full 800px:max-w-[520px] px-5 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a]"
              />

              <p className="text-[14px] text-gray-600 dark:text-gray-300">
                {filteredCourses.length} course
                {filteredCourses.length === 1 ? "" : "s"} found
              </p>
            </div>
          </section>

          {!authChecked && (
            <section className="grid grid-cols-1 800px:grid-cols-2 1100px:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] shadow-sm"
                >
                  <div className="h-[200px] bg-gray-200 dark:bg-slate-800 animate-pulse" />
                  <div className="p-5 space-y-4">
                    <div className="h-6 w-[80%] bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-4 w-[55%] bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-10 w-full bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </section>
          )}

          {authChecked && courses.length === 0 && (
            <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
              <div className="max-w-[620px] mx-auto px-5">
                <h2 className="text-[26px] 800px:text-[32px] font-Poppins font-[700] text-black dark:text-white">
                  You have not enrolled in any courses yet
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mt-4 leading-7">
                  Once you enroll in a course, it will appear here. You can then
                  open the learning page and continue your lessons anytime.
                </p>

                <Link href="/courses">
                  <button className="mt-7 px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold hover:opacity-90 transition">
                    Browse Courses
                  </button>
                </Link>
              </div>
            </section>
          )}

          {authChecked && courses.length > 0 && filteredCourses.length === 0 && (
            <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
              <h2 className="text-[26px] font-Poppins font-[700] text-black dark:text-white">
                No matching enrolled courses
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mt-3">
                Try searching with a different keyword.
              </p>

              <button
                onClick={() => setSearch("")}
                className="mt-6 px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold hover:opacity-90 transition"
              >
                Clear Search
              </button>
            </section>
          )}

          {authChecked && filteredCourses.length > 0 && (
            <section className="grid grid-cols-1 800px:grid-cols-2 1100px:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <article
                  key={course.id}
                  className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <div className="relative h-[205px] bg-gray-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                    />

                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[12px] font-semibold">
                        Enrolled
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {course.category && (
                        <span className="text-[12px] px-3 py-1 rounded-full bg-[#37a39a1a] text-[#37a39a] font-semibold">
                          {course.category}
                        </span>
                      )}

                      {course.level && (
                        <span className="text-[12px] px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 font-semibold">
                          {course.level}
                        </span>
                      )}
                    </div>

                    <h2 className="text-[20px] font-Poppins font-[600] text-black dark:text-white leading-7 min-h-[56px] overflow-hidden">
                      {course.title}
                    </h2>

                    {course.purchasedAt && (
                      <p className="text-[14px] text-gray-500 dark:text-gray-300 mt-2">
                        Enrolled:{" "}
                        {new Date(course.purchasedAt).toLocaleDateString()}
                      </p>
                    )}

                    <div className="grid grid-cols-1 gap-3 mt-5">
                      <Link href={`/course-access/${course.id}`}>
                        <button className="w-full py-3 rounded-lg bg-[#37a39a] text-white font-semibold hover:opacity-90 transition">
                          Start Learning
                        </button>
                      </Link>

                      <Link href={`/course/${course.id}`}>
                        <button className="w-full py-3 rounded-lg border border-[#37a39a] text-[#37a39a] font-semibold hover:bg-[#37a39a1a] transition">
                          View Course Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </Protected>
  );
};

export default MyCoursesPage;

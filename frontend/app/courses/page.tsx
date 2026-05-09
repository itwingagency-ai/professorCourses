"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import Ratings from "../utils/Ratings";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";

type NormalizedCourse = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  level: string;
  price: number;
  estimatedPrice?: number;
  rating: number;
  reviewsCount: number;
  purchased: number;
};

const fallbackImage = "/assests/banner-img-1.png";

const getCourseArray = (data: any): any[] => {
  if (!data) return [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.courses)) return data.courses;
  if (Array.isArray(data.course)) return data.course;
  if (Array.isArray(data.data)) return data.data;

  return [];
};

const normalizeCourse = (course: any): NormalizedCourse => {
  const id = course?._id || course?.id || "";

  const thumbnail =
    course?.thumbnail?.url ||
    course?.thumbnail?.secure_url ||
    course?.thumbnail ||
    course?.image?.url ||
    course?.image ||
    fallbackImage;

  return {
    id,
    title: course?.name || course?.title || "Untitled Course",
    description:
      course?.description ||
      course?.shortDescription ||
      course?.subtitle ||
      "View course details and start your learning journey.",
    image: thumbnail,
    category: course?.categories || course?.category || "General",
    level: course?.level || course?.difficulty || "Beginner",
    price: Number(course?.price || 0),
    estimatedPrice:
      course?.estimatedPrice || course?.originalPrice || course?.oldPrice,
    rating: Number(course?.ratings || course?.rating || 0),
    reviewsCount: Array.isArray(course?.reviews)
      ? course.reviews.length
      : Number(course?.reviewsCount || 0),
    purchased: Number(course?.purchased || course?.sold || course?.enrolled || 0),
  };
};

const CoursesPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllCoursesQuery({});

  const normalizedCourses = useMemo(() => {
    return getCourseArray(data)
      .map(normalizeCourse)
      .filter((course) => Boolean(course.id));
  }, [data]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(normalizedCourses.map((course) => course.category).filter(Boolean))
    );

    return ["All", ...uniqueCategories];
  }, [normalizedCourses]);

  const levels = useMemo(() => {
    const uniqueLevels = Array.from(
      new Set(normalizedCourses.map((course) => course.level).filter(Boolean))
    );

    return ["All", ...uniqueLevels];
  }, [normalizedCourses]);

  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return normalizedCourses.filter((course) => {
      const matchesSearch =
        !keyword ||
        `${course.title} ${course.description} ${course.category} ${course.level}`
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "All" || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [normalizedCourses, search, selectedCategory, selectedLevel]);

  return (
    <div>
      <Heading
        title="Courses - 3S Consultant"
        description="Browse all available courses"
        keywords="courses, LMS, online learning, 3S Consultant"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={1}
        setRoute={setRoute}
        route={route}
      />

      <main className="w-[92%] 800px:w-[85%] mx-auto py-12">
        <section className="text-center mb-10">
          <p className="text-[#37a39a] font-Poppins font-[600] mb-2">
            Learn with 3S Consultant
          </p>

          <h1 className="text-[32px] 800px:text-[46px] font-Poppins font-[700] text-black dark:text-white leading-tight">
            Explore Our Courses
          </h1>

          <p className="max-w-[720px] mx-auto text-[16px] text-gray-600 dark:text-gray-300 mt-4 leading-7">
            Browse available courses, view details, and start learning with a
            structured LMS experience.
          </p>
        </section>

        <section className="mb-10 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] shadow-sm p-4 800px:p-6">
          <div className="grid grid-cols-1 800px:grid-cols-[1fr_220px_220px] gap-4">
            <input
              type="text"
              placeholder="Search by course name, category, or level..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a]"
            />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a]"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === "All" ? "All Levels" : level}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
            <p className="text-[14px] text-gray-600 dark:text-gray-300">
              {isLoading || isFetching
                ? "Loading courses..."
                : `${filteredCourses.length} course${
                    filteredCourses.length === 1 ? "" : "s"
                  } found`}
            </p>

            {(search || selectedCategory !== "All" || selectedLevel !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                }}
                className="text-[14px] text-[#37a39a] font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        {(isLoading || isFetching) && (
          <section className="grid grid-cols-1 800px:grid-cols-2 1100px:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] shadow-sm"
              >
                <div className="h-[200px] bg-gray-200 dark:bg-slate-800 animate-pulse" />
                <div className="p-5 space-y-4">
                  <div className="h-4 w-[45%] rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-6 w-[85%] rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-full rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-[70%] rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-10 w-full rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
                </div>
              </div>
            ))}
          </section>
        )}

        {!isLoading && !isFetching && isError && (
          <section className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
            <h2 className="text-[26px] font-Poppins font-[700] text-red-500">
              Failed to load courses
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-3">
              Please make sure the backend server is running and the API URL is correct.
            </p>

            <button
              onClick={() => refetch()}
              className="mt-6 px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
          </section>
        )}

        {!isLoading &&
          !isFetching &&
          !isError &&
          normalizedCourses.length === 0 && (
            <section className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
              <h2 className="text-[26px] font-Poppins font-[700] text-black dark:text-white">
                No courses available yet
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mt-3">
                Courses created by admin will appear here.
              </p>
            </section>
          )}

        {!isLoading &&
          !isFetching &&
          !isError &&
          normalizedCourses.length > 0 &&
          filteredCourses.length === 0 && (
            <section className="text-center py-16 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
              <h2 className="text-[26px] font-Poppins font-[700] text-black dark:text-white">
                No matching courses found
              </h2>

              <p className="text-gray-600 dark:text-gray-300 mt-3">
                Try changing your search keyword or filters.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                }}
                className="mt-6 px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold hover:opacity-90 transition"
              >
                Reset Filters
              </button>
            </section>
          )}

        {!isLoading &&
          !isFetching &&
          !isError &&
          filteredCourses.length > 0 && (
            <section className="grid grid-cols-1 800px:grid-cols-2 1100px:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Link href={`/course/${course.id}`} key={course.id}>
                  <article className="h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] shadow-sm hover:shadow-xl hover:shadow-[#37a39a]/10 hover:-translate-y-2 transition duration-300 cursor-pointer flex flex-col group">
                    <div className="relative w-full h-[205px] bg-gray-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                        }}
                      />

                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#37a39a] text-white text-[12px] font-semibold shadow-md">
                          {course.category}
                        </span>
                        {course.purchased > 1000 && (
                          <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-[12px] font-semibold shadow-md flex items-center gap-1">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149.1 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.691 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.691 316.9 17.97L381.2 150.3z"></path></svg>
                            Popular
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-[13px] px-3 py-1 rounded-full bg-[#37a39a1a] text-[#37a39a] font-semibold">
                          {course.level}
                        </span>

                        <span className="text-[13px] text-gray-500 dark:text-gray-300">
                          {course.purchased} enrolled
                        </span>
                      </div>

                      <h2 className="text-[20px] font-Poppins font-[600] text-black dark:text-white leading-7 min-h-[56px] overflow-hidden">
                        {course.title}
                      </h2>

                      <p className="text-[14px] text-gray-600 dark:text-gray-300 mt-3 leading-6 min-h-[48px] max-h-[48px] overflow-hidden">
                        {course.description}
                      </p>

                      <div className="flex items-center mt-4">
                        <Ratings rating={course.rating} />
                        <span className="text-[13px] text-gray-500 dark:text-gray-300 ml-2">
                          ({course.reviewsCount})
                        </span>
                      </div>

                      <div className="mt-auto pt-5 border-t border-gray-100 dark:border-[#ffffff1d]">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[24px] font-Poppins font-[700] text-black dark:text-white">
                              {course.price === 0 ? "Free" : `$${course.price}`}
                            </span>

                            {course.estimatedPrice && (
                              <span className="text-[14px] line-through text-gray-400 ml-2">
                                ${course.estimatedPrice}
                              </span>
                            )}
                          </div>

                          <span className="px-4 py-2 rounded-lg bg-[#37a39a1a] text-[#37a39a] text-[14px] font-semibold group-hover:bg-[#37a39a] group-hover:text-white transition-colors duration-300">
                            View Details
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </section>
          )}
      </main>
    </div>
  );
};

export default CoursesPage;

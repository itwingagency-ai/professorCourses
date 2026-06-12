"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import Ratings from "../utils/Ratings";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { normalizeCoursesResponse } from "@/lib/normalizers";
import { HiOutlineSearch, HiOutlineAdjustments, HiOutlineX } from "react-icons/hi";
import { FiRefreshCw } from "react-icons/fi";
import { FaStar, FaUsers } from "react-icons/fa";

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

const getCourseArray = (data: any): any[] => normalizeCoursesResponse(data);

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
    description: course?.description || course?.shortDescription || course?.subtitle || "View course details and start your learning journey.",
    image: thumbnail,
    category: course?.categories || course?.category || "General",
    level: course?.level || course?.difficulty || "Beginner",
    price: Number(course?.price || 0),
    estimatedPrice: course?.estimatedPrice || course?.originalPrice || course?.oldPrice,
    rating: Number(course?.ratings || course?.rating || 0),
    reviewsCount: Array.isArray(course?.reviews) ? course.reviews.length : Number(course?.reviewsCount || 0),
    purchased: Number(course?.purchased || course?.sold || course?.enrolled || 0),
  };
};

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  Intermediate: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  Advanced: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
};

const CoursesPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading, isFetching, isError, refetch } = useGetAllCoursesQuery({});

  const normalizedCourses = useMemo(() => {
    return getCourseArray(data).map(normalizeCourse).filter((c) => Boolean(c.id));
  }, [data]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(normalizedCourses.map((c) => c.category).filter(Boolean)));
    return ["All", ...unique];
  }, [normalizedCourses]);

  const levels = useMemo(() => {
    const unique = Array.from(new Set(normalizedCourses.map((c) => c.level).filter(Boolean)));
    return ["All", ...unique];
  }, [normalizedCourses]);

  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return normalizedCourses.filter((c) => {
      const matchSearch = !keyword || `${c.title} ${c.description} ${c.category} ${c.level}`.toLowerCase().includes(keyword);
      const matchCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchLevel = selectedLevel === "All" || c.level === selectedLevel;
      return matchSearch && matchCategory && matchLevel;
    });
  }, [normalizedCourses, search, selectedCategory, selectedLevel]);

  const hasFilters = search || selectedCategory !== "All" || selectedLevel !== "All";

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedLevel("All");
  };

  return (
    <div>
      <Heading
        title="Courses - 3S Consultant"
        description="Browse all available courses"
        keywords="courses, LMS, online learning, 3S Consultant"
      />
      <Header open={open} setOpen={setOpen} activeItem={1} setRoute={setRoute} route={route} />

      <main className="w-[92%] 800px:w-[88%] max-w-[1400px] mx-auto py-12 mt-[80px]">
        {/* Page Header */}
        <section className="text-center mb-10">
          <span className="inline-block text-primary font-Inter font-semibold text-sm uppercase tracking-wider mb-3">
            Learn with 3S Consultant
          </span>
          <h1 className="text-[32px] 800px:text-[48px] font-Outfit font-[800] text-gray-900 dark:text-white leading-tight mb-4">
            Explore Our Courses
          </h1>
          <p className="max-w-[600px] mx-auto text-gray-500 dark:text-gray-400 text-[16px] font-Inter leading-relaxed">
            Browse our full library of professionally designed courses and start building your skills today.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <section className="mb-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search input */}
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search courses by name, category or level..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-800/50 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 font-Inter text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <HiOutlineX size={16} />
                </button>
              )}
            </div>

            {/* Filter pills row */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium font-Inter mr-1">
                <HiOutlineAdjustments size={14} />
                Filter:
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 font-Inter
                      ${selectedCategory === cat
                        ? "bg-primary text-white shadow-sm shadow-primary/30"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary"
                      }`}
                  >
                    {cat === "All" ? "All Categories" : cat}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-5 w-px bg-gray-200 dark:bg-white/10 mx-1" />

              {/* Level pills */}
              <div className="flex flex-wrap gap-1.5">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 font-Inter
                      ${selectedLevel === level
                        ? "bg-gray-800 dark:bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                      }`}
                  >
                    {level === "All" ? "All Levels" : level}
                  </button>
                ))}
              </div>
            </div>

            {/* Results row */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-white/5">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-Inter">
                {isLoading || isFetching ? (
                  <span className="flex items-center gap-2">
                    <FiRefreshCw size={12} className="animate-spin" />
                    Loading courses...
                  </span>
                ) : (
                  <>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">
                      {filteredCourses.length}
                    </span>{" "}
                    course{filteredCourses.length !== 1 ? "s" : ""} found
                  </>
                )}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primaryDark font-semibold transition-colors font-Inter"
                >
                  <HiOutlineX size={12} />
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Loading Skeletons */}
        {(isLoading || isFetching) && (
          <section className="grid grid-cols-1 800px:grid-cols-2 1100px:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="h-[200px] skeleton" />
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <div className="h-5 w-20 skeleton rounded-full" />
                    <div className="h-5 w-16 skeleton rounded-full" />
                  </div>
                  <div className="h-5 w-full skeleton rounded" />
                  <div className="h-4 w-4/5 skeleton rounded" />
                  <div className="h-3 w-3/5 skeleton rounded" />
                  <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex justify-between">
                    <div className="h-6 w-16 skeleton rounded" />
                    <div className="h-8 w-24 skeleton rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Error State */}
        {!isLoading && !isFetching && isError && (
          <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
              <HiOutlineX className="text-red-500 text-2xl" />
            </div>
            <h2 className="text-xl font-Poppins font-bold text-gray-800 dark:text-white mb-2">
              Failed to load courses
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto font-Inter">
              Make sure the backend server is running and your connection is stable.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primaryDark text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              <FiRefreshCw size={15} />
              Try Again
            </button>
          </section>
        )}

        {/* No Courses Yet */}
        {!isLoading && !isFetching && !isError && normalizedCourses.length === 0 && (
          <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-Poppins font-bold text-gray-800 dark:text-white mb-2">
              No courses yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-Inter">
              Courses will appear here once instructors publish them.
            </p>
          </section>
        )}

        {/* No Matching Results */}
        {!isLoading && !isFetching && !isError && normalizedCourses.length > 0 && filteredCourses.length === 0 && (
          <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-Poppins font-bold text-gray-800 dark:text-white mb-2">
              No matching courses
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 font-Inter">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primaryDark text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Reset Filters
            </button>
          </section>
        )}

        {/* Course Grid */}
        {!isLoading && !isFetching && !isError && filteredCourses.length > 0 && (
          <section className="grid grid-cols-1 800px:grid-cols-2 1100px:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link href={`/course/${course.id}`} key={course.id}>
                <article className="group h-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative w-full h-[210px] bg-gray-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    />
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[11px] font-bold shadow-md">
                        {course.category}
                      </span>
                      {course.purchased > 1000 && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                          <FaStar size={9} />
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Level badge */}
                    <div className="absolute bottom-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${levelColors[course.level] || "bg-gray-100 text-gray-600"}`}>
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-[16px] font-Poppins font-[700] text-gray-900 dark:text-white leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {course.title}
                    </h2>

                    <p className="text-[13px] text-gray-500 dark:text-gray-400 font-Inter leading-relaxed line-clamp-2 mb-3">
                      {course.description}
                    </p>

                    {/* Rating + Enrolled */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Ratings rating={course.rating} />
                        <span className="text-[12px] text-gray-500 font-Inter">
                          ({course.reviewsCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] text-gray-400 dark:text-gray-500 font-Inter ml-auto">
                        <FaUsers size={11} />
                        {course.purchased.toLocaleString()} enrolled
                      </div>
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[22px] font-Outfit font-[800] text-gray-900 dark:text-white">
                          {course.price === 0 ? "Free" : `$${course.price}`}
                        </span>
                        {course.estimatedPrice && (
                          <span className="text-[13px] line-through text-gray-400 font-Inter">
                            ${course.estimatedPrice}
                          </span>
                        )}
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[13px] font-semibold group-hover:bg-primary group-hover:text-white transition-all duration-300 font-Inter">
                        View Details →
                      </span>
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

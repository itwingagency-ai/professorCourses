"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import Protected from "../../hooks/useprotected";
import Heading from "../../utils/Heading";
import { useGetCourseContentQuery } from "@/redux/features/courses/coursesApi";
import LessonQuestions from "../../components/Course/LessonQuestions";
import CourseReview from "../../components/Course/CourseReview";
import CoursePlayer from "../../utils/CoursePlayer";
import { normalizeSingleCourseResponse, normalizeCourseContentResponse } from "@/lib/normalizers";
import StudentProgressBar from "../../components/Student/StudentProgressBar";
import {
  useGetStudentProgressQuery,
  useMarkLessonCompleteMutation,
  useSaveLastLessonMutation,
} from "@/redux/features/student/studentApi";
import toast from "react-hot-toast";

type NormalizedLesson = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoSection?: string;
  videoLength?: string | number;
  links: any[];
  questions: any[];
};

type NormalizedCourseContent = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  lessons: NormalizedLesson[];
};

const fallbackImage = "/assests/banner-img-1.png";

const getCourseObject = (data: any): any => {
  return normalizeSingleCourseResponse(data) || data;
};

const getLessonsArray = (data: any): any[] => {
  return normalizeCourseContentResponse(data);
};

const normalizeCourseContent = (data: any, courseId: string): NormalizedCourseContent => {
  const course = getCourseObject(data);
  const lessonsSource = getLessonsArray(data);

  const lessons = lessonsSource.map((lesson: any, index: number) => ({
    id: lesson?._id || lesson?.id || `${index}`,
    title: lesson?.title || lesson?.name || `Lesson ${index + 1}`,
    description:
      lesson?.description ||
      lesson?.summary ||
      "No lesson description available.",
    videoUrl:
      lesson?.videoUrl ||
      lesson?.video?.url ||
      lesson?.url ||
      lesson?.videoData?.videoUrl ||
      "",
    videoSection: lesson?.videoSection || lesson?.section || "",
    videoLength: lesson?.videoLength || lesson?.duration || "",
    links: Array.isArray(lesson?.links) ? lesson.links : [],
    questions: Array.isArray(lesson?.questions) ? lesson.questions : [],
  }));

  return {
    id: course?._id || course?.id || courseId,
    title: course?.name || course?.title || "Course Learning",
    description: course?.description || "Continue your course learning.",
    thumbnail:
      course?.thumbnail?.url ||
      course?.thumbnail?.secure_url ||
      course?.thumbnail ||
      fallbackImage,
    lessons,
  };
};

const getPurchasedCourseId = (item: any) => {
  return item?.courseId?._id || item?.courseId || item?._id || item?.id;
};

const CourseAccessPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, authChecked } = useSelector((state: any) => state.auth);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetCourseContentQuery(courseId, {
    skip: !courseId || !user,
  });

  const courseContent = useMemo(() => {
    return normalizeCourseContent(data, courseId);
  }, [data, courseId]);

  const lessons = courseContent.lessons;
  const activeLesson = lessons[activeLessonIndex];

  const isPurchasedFromUserState = useMemo(() => {
    if (!user?.courses || !courseId) return false;

    return user.courses.some((item: any) => {
      const purchasedId = getPurchasedCourseId(item);
      return purchasedId?.toString() === courseId?.toString();
    });
  }, [user, courseId]);

  const {
    data: progressData,
    refetch: refetchProgress,
  } = useGetStudentProgressQuery(courseId, { skip: !courseId || !user });

  const [markComplete, { isLoading: isMarking }] = useMarkLessonCompleteMutation();
  const [saveLastLesson] = useSaveLastLessonMutation();

  const progress = progressData?.progress;
  const completedLessonIds = progress?.completedLessons?.map((l: any) => l.lessonId) || [];
  const progressPercentage = progress?.progressPercentage || 0;

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (progress?.lastLessonId && !initialLoadDone && lessons.length > 0) {
      const idx = lessons.findIndex((l) => l.id === progress.lastLessonId);
      if (idx !== -1) {
        setActiveLessonIndex(idx);
      }
      setInitialLoadDone(true);
    } else if (lessons.length > 0 && !initialLoadDone) {
      setInitialLoadDone(true);
    }
  }, [progress?.lastLessonId, lessons, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone && activeLesson?.id && user) {
      saveLastLesson({ courseId, lessonId: activeLesson.id });
    }
  }, [activeLesson?.id, initialLoadDone, courseId, saveLastLesson, user]);

  const handleMarkComplete = async () => {
    if (!activeLesson?.id) return;
    try {
      await markComplete({ courseId, lessonId: activeLesson.id }).unwrap();
      toast.success("Lesson marked as complete!");
      refetchProgress();
      
      // Auto-advance
      if (activeLessonIndex < lessons.length - 1) {
        setActiveLessonIndex((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to mark lesson complete");
    }
  };

  const isCurrentLessonCompleted = completedLessonIds.includes(activeLesson?.id);

  useEffect(() => {
    if (activeLessonIndex >= lessons.length && lessons.length > 0) {
      setActiveLessonIndex(0);
    }
  }, [activeLessonIndex, lessons.length]);

  const goToNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getErrorMessage = () => {
    const apiError: any = error;

    return (
      apiError?.data?.message ||
      apiError?.error ||
      "You may not be enrolled in this course yet, or the backend access check needs attention."
    );
  };

  return (
    <Protected>
      <div>
        <Heading
          title={`${courseContent.title || "Course Learning"} - 3S Consultant`}
          description="Access your enrolled course content"
          keywords="course learning, LMS, lessons"
        />

        <Header
          open={open}
          setOpen={setOpen}
          activeItem={1}
          setRoute={setRoute}
          route={route}
        />

        <main className="w-[95%] 1200px:w-[92%] mx-auto py-8">
          {(isLoading || isFetching || !authChecked) && (
            <section className="grid grid-cols-1 1000px:grid-cols-[340px_1fr] gap-6">
              <div className="h-[680px] rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-[680px] rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse" />
            </section>
          )}

          {!isLoading && !isFetching && isError && (
            <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
              <h1 className="text-[28px] font-Poppins font-[700] text-red-500">
                Course access denied
              </h1>

              <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-[720px] mx-auto px-5 leading-7">
                {getErrorMessage()}
              </p>

              <div className="flex flex-col 800px:flex-row gap-3 justify-center mt-7">
                <button
                  onClick={() => refetch()}
                  className="px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold hover:opacity-90 transition"
                >
                  Try Again
                </button>

                <Link href={`/course/${courseId}`}>
                  <button className="px-8 py-3 rounded-lg border border-[#37a39a] text-[#37a39a] font-semibold hover:bg-[#37a39a1a] transition">
                    View Course Details
                  </button>
                </Link>

                <Link href="/student/my-courses">
                  <button className="px-8 py-3 rounded-lg border border-gray-300 dark:border-[#ffffff1d] text-black dark:text-white font-semibold">
                    My Courses
                  </button>
                </Link>
              </div>
            </section>
          )}

          {!isLoading &&
            !isFetching &&
            !isError &&
            lessons.length === 0 && (
              <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
                <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white">
                  No course content found
                </h1>

                <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-[650px] mx-auto px-5 leading-7">
                  You may be enrolled, but this course does not have lessons added
                  yet.
                </p>

                <Link href="/student/my-courses">
                  <button className="mt-7 px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold">
                    Back to My Courses
                  </button>
                </Link>
              </section>
            )}

          {!isLoading &&
            !isFetching &&
            !isError &&
            lessons.length > 0 && (
              <section className="grid grid-cols-1 1000px:grid-cols-[350px_1fr] gap-6">
                <aside className="hidden 1000px:block h-fit rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-4 sticky top-[95px]">
                  <div className="mb-5">
                    <h2 className="text-[22px] font-Poppins font-[700] text-black dark:text-white">
                      Course Lessons
                    </h2>

                    <p className="text-[14px] text-gray-600 dark:text-gray-300 mt-1 mb-4">
                      {lessons.length} lesson{lessons.length === 1 ? "" : "s"}
                    </p>
                    
                    <StudentProgressBar percentage={progressPercentage} />
                  </div>

                  <div className="space-y-3 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
                    {lessons.map((lesson, index) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonIndex(index)}
                        className={`w-full text-left p-4 rounded-xl border transition ${
                          activeLessonIndex === index
                            ? "bg-[#37a39a] text-white border-[#37a39a]"
                            : "bg-transparent text-black dark:text-white border-gray-200 dark:border-[#ffffff1d] hover:border-[#37a39a]"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="block text-[13px] opacity-80">
                            Lesson {index + 1}
                            {lesson.videoLength ? ` • ${lesson.videoLength} min` : ""}
                          </span>
                          {isCompleted && (
                            <span className="text-green-300">✓</span>
                          )}
                        </div>

                        <span className="block font-Poppins font-[600] mt-1 line-clamp-2">
                          {lesson.title}
                        </span>

                        {lesson.videoSection && (
                          <span className="block text-[12px] opacity-80 mt-1">
                            {lesson.videoSection}
                          </span>
                        )}
                      </button>
                      );
                    })}
                  </div>
                </aside>

                <div className="1000px:hidden">
                  <button
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    className="w-full mb-4 py-3 rounded-lg bg-[#37a39a] text-white font-semibold"
                  >
                    {sidebarOpen ? "Hide Lessons" : "Show Lessons"}
                  </button>

                  {sidebarOpen && (
                    <div className="mb-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-4">
                      <div className="space-y-3 max-h-[420px] overflow-y-auto">
                        {lessons.map((lesson, index) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setActiveLessonIndex(index);
                              setSidebarOpen(false);
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition ${
                              activeLessonIndex === index
                                ? "bg-[#37a39a] text-white border-[#37a39a]"
                                : "bg-transparent text-black dark:text-white border-gray-200 dark:border-[#ffffff1d]"
                            }`}
                          >
                            <span className="block text-[13px] opacity-80">
                              Lesson {index + 1}
                            </span>
                            <span className="block font-semibold mt-1">
                              {lesson.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <main className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] overflow-hidden">
                  <div className="w-full bg-black aspect-video flex items-center justify-center">
                    {activeLesson?.videoUrl ? (
                      /^https?:\/\//i.test(activeLesson.videoUrl) && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(activeLesson.videoUrl) ? (
                        <video
                          src={activeLesson.videoUrl}
                          controls
                          className="w-full h-full"
                        />
                      ) : !/^https?:\/\//i.test(activeLesson.videoUrl) && activeLesson.videoUrl.length >= 8 ? (
                        <div className="w-full h-full relative">
                          <div className="absolute inset-0 w-full h-full">
                             <CoursePlayer
                                videoUrl={activeLesson.videoUrl}
                                title={activeLesson.title}
                                courseId={courseId}
                                contentId={String((activeLesson as any)._id || activeLesson.id)}
                             />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-8">
                          <h3 className="text-[24px] font-Poppins font-[700] text-white">
                            Video format not supported
                          </h3>
                        </div>
                      )
                    ) : (
                      <div className="text-center p-8">
                        <h3 className="text-[24px] font-Poppins font-[700] text-white">
                          Video not configured
                        </h3>

                        <p className="text-gray-300 mt-2 max-w-[520px]">
                          This lesson is available, but video URL or VdoCipher
                          playback is not configured yet.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-5 800px:p-8">
                    <div className="flex flex-col 800px:flex-row 800px:items-start 800px:justify-between gap-4">
                      <div>
                        <p className="text-[#37a39a] font-Poppins font-[600]">
                          Lesson {activeLessonIndex + 1} of {lessons.length}
                        </p>

                        <h1 className="text-[28px] 800px:text-[36px] font-Poppins font-[700] text-black dark:text-white mt-2 leading-tight">
                          {activeLesson?.title}
                        </h1>

                        {activeLesson?.videoSection && (
                          <p className="text-[14px] text-gray-500 dark:text-gray-300 mt-2">
                            Section: {activeLesson.videoSection}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={goToPreviousLesson}
                          disabled={activeLessonIndex === 0}
                          className={`px-5 py-2 rounded-lg font-semibold ${
                            activeLessonIndex === 0
                              ? "bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
                              : "bg-[#37a39a1a] text-[#37a39a]"
                          }`}
                        >
                          Previous
                        </button>

                        {!isCurrentLessonCompleted ? (
                          <button
                            onClick={handleMarkComplete}
                            disabled={isMarking}
                            className={`px-5 py-2 rounded-lg font-semibold bg-[#37a39a] text-white hover:bg-[#2b857d] transition ${isMarking ? 'opacity-50' : ''}`}
                          >
                            {isMarking ? "Saving..." : "Mark Complete"}
                          </button>
                        ) : (
                          <button
                            onClick={goToNextLesson}
                            disabled={activeLessonIndex === lessons.length - 1}
                            className={`px-5 py-2 rounded-lg font-semibold ${
                              activeLessonIndex === lessons.length - 1
                                ? "bg-gray-200 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
                                : "bg-[#37a39a] text-white"
                            }`}
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mt-6 leading-8">
                      {activeLesson?.description}
                    </p>

                    {activeLesson?.links?.length > 0 && (
                      <div className="mt-10">
                        <h2 className="text-[24px] font-Poppins font-[700] text-black dark:text-white">
                          Resources
                        </h2>

                        <div className="mt-4 grid grid-cols-1 800px:grid-cols-2 gap-3">
                          {activeLesson.links.map((link: any, index: number) => (
                            <a
                              key={index}
                              href={link?.url || link?.link || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="p-4 rounded-xl border border-gray-200 dark:border-[#ffffff1d] bg-gray-50 dark:bg-slate-800 text-[#37a39a] font-semibold hover:opacity-80 transition"
                            >
                              {link?.title || link?.name || link?.url || "Resource"}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <LessonQuestions
                      courseId={courseId}
                      lesson={activeLesson}
                      refetchCourseContent={refetch}
                    />

                    <CourseReview
                      courseId={courseId}
                      course={getCourseObject(data)}
                      refetchCourseContent={refetch}
                    />
                  </div>
                </main>
              </section>
            )}
        </main>
      </div>
    </Protected>
  );
};

export default CourseAccessPage;

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
import CourseQuizzes from "../../components/Course/CourseQuizzes";
import CourseAssignments from "../../components/Course/CourseAssignments";
import CourseCertificate from "../../components/Course/CourseCertificate";
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
  const [activeTab, setActiveTab] = useState("Overview");
  const [lessonNote, setLessonNote] = useState("");
  const [saveNoteStatus, setSaveNoteStatus] = useState("");

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
      
      // Load note from local storage
      const noteKey = `note_${courseId}_${activeLesson.id}`;
      const savedNote = localStorage.getItem(noteKey);
      setLessonNote(savedNote || "");
      setSaveNoteStatus("");
    }
  }, [activeLesson?.id, initialLoadDone, courseId, saveLastLesson, user]);

  const handleSaveNote = () => {
    if (!activeLesson?.id) return;
    const noteKey = `note_${courseId}_${activeLesson.id}`;
    localStorage.setItem(noteKey, lessonNote);
    setSaveNoteStatus("Saved!");
    setTimeout(() => setSaveNoteStatus(""), 2000);
  };

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
              <section className="grid grid-cols-1 1000px:grid-cols-[1fr_350px] gap-6 items-start">
                {/* Mobile sidebar toggle */}
                <div className="1000px:hidden w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-4 rounded-xl mb-4">
                  <div>
                    <p className="text-[13px] text-gray-500">Current Lesson</p>
                    <h3 className="font-semibold line-clamp-1">{activeLesson?.title}</h3>
                  </div>
                  <button
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    className="px-4 py-2 rounded-lg bg-[#37a39a] text-white font-semibold text-sm whitespace-nowrap"
                  >
                    {sidebarOpen ? "Hide Lessons" : "Show Lessons"}
                  </button>
                </div>

                {/* Mobile Sidebar Dropdown */}
                {sidebarOpen && (
                  <div className="1000px:hidden mb-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-4">
                    <div className="mb-4">
                      <StudentProgressBar percentage={progressPercentage} />
                    </div>
                    <div className="space-y-2 max-h-[420px] overflow-y-auto">
                      {lessons.map((lesson, index) => {
                        const isCompleted = completedLessonIds.includes(lesson.id);
                        return (
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
                          <div className="flex justify-between items-center mb-1">
                            <span className="block text-[12px] opacity-80">Lesson {index + 1}</span>
                            {isCompleted && <span className="text-green-500">✓</span>}
                          </div>
                          <span className="block font-semibold text-sm line-clamp-2">
                            {lesson.title}
                          </span>
                        </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Main Content Area */}
                <main className="w-full flex flex-col gap-6">
                  {/* Video Player Box */}
                  <div className="rounded-2xl bg-black overflow-hidden shadow-lg border border-gray-800">
                    {activeLesson?.videoUrl ? (
                      <CoursePlayer
                        videoUrl={activeLesson.videoUrl}
                        title={activeLesson.title}
                        courseId={courseId}
                        contentId={String((activeLesson as any)._id || activeLesson.id)}
                      />
                    ) : (
                      <div className="aspect-video flex items-center justify-center bg-slate-900">
                        <div className="text-center p-8">
                          <h3 className="text-[24px] font-Poppins font-[700] text-white">
                            Video not configured
                          </h3>
                          <p className="text-gray-400 mt-2 max-w-[520px]">
                            This lesson is available, but video URL or playback is not configured yet.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tabs & Content Box */}
                  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] overflow-hidden">
                    <div className="p-5 sm:p-8">
                      {/* Lesson Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                        <div>
                          <p className="text-[#37a39a] font-Poppins font-[600] text-sm uppercase tracking-wider">
                            Lesson {activeLessonIndex + 1} of {lessons.length}
                          </p>
                          <h1 className="text-[24px] sm:text-[32px] font-Poppins font-[700] text-black dark:text-white mt-2 leading-tight">
                            {activeLesson?.title}
                          </h1>
                          {activeLesson?.videoSection && (
                            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full text-[12px] text-gray-500 dark:text-gray-400 mt-3 font-medium">
                              Section: {activeLesson.videoSection}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={goToPreviousLesson}
                            disabled={activeLessonIndex === 0}
                            className={`p-3 rounded-xl transition ${
                              activeLessonIndex === 0
                                ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
                                : "bg-gray-100 dark:bg-slate-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700"
                            }`}
                            title="Previous Lesson"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          </button>

                          {!isCurrentLessonCompleted ? (
                            <button
                              onClick={handleMarkComplete}
                              disabled={isMarking}
                              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#37a39a] text-white hover:bg-[#2b857d] transition shadow-md shadow-[#37a39a]/20 ${isMarking ? 'opacity-70' : ''}`}
                            >
                              {isMarking ? "Saving..." : (
                                <>
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                  Mark Complete
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={goToNextLesson}
                              disabled={activeLessonIndex === lessons.length - 1}
                              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition ${
                                activeLessonIndex === lessons.length - 1
                                  ? "bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed"
                                  : "bg-[#37a39a] text-white hover:bg-[#2b857d] shadow-md shadow-[#37a39a]/20"
                              }`}
                            >
                              Next Lesson
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Tabs Navigation */}
                      <div className="flex gap-1 sm:gap-4 overflow-x-auto border-b border-gray-200 dark:border-[#ffffff1d] mb-6 pb-2 scrollbar-hide">
                        {["Overview", "Resources", "Notes", "Q&A", "Reviews", "Quizzes", "Assignments", "Certificate"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 font-semibold text-sm transition-colors whitespace-nowrap rounded-lg ${
                              activeTab === tab
                                ? "bg-[#37a39a]/10 text-[#37a39a]"
                                : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            {tab}
                            {tab === "Resources" && activeLesson?.links?.length > 0 && (
                              <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-slate-700 rounded-full text-xs">
                                {activeLesson.links.length}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <div className="min-h-[300px]">
                        {activeTab === "Overview" && (
                          <div className="prose dark:prose-invert max-w-none">
                            {activeLesson?.description ? (
                              <p className="text-gray-600 dark:text-gray-300 leading-8 whitespace-pre-line">
                                {activeLesson.description}
                              </p>
                            ) : (
                              <p className="text-gray-400 italic">No description provided for this lesson.</p>
                            )}
                          </div>
                        )}

                        {activeTab === "Resources" && (
                          <div>
                            {activeLesson?.links?.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {activeLesson.links.map((link: any, index: number) => (
                                  <a
                                    key={index}
                                    href={link?.url || link?.link || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-[#ffffff1d] bg-gray-50 dark:bg-slate-800 hover:border-[#37a39a] transition group"
                                  >
                                    <div className="w-10 h-10 rounded-full bg-[#37a39a]/10 flex items-center justify-center text-[#37a39a] group-hover:bg-[#37a39a] group-hover:text-white transition">
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    </div>
                                    <span className="font-semibold text-black dark:text-white">
                                      {link?.title || link?.name || "Download Resource"}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">No resources available for this lesson.</p>
                            )}
                          </div>
                        )}

                        {activeTab === "Notes" && (
                          <div className="flex flex-col h-full">
                            <p className="text-sm text-gray-500 mb-4">
                              Personal notes for this lesson. Saved automatically to your browser.
                            </p>
                            <textarea
                              value={lessonNote}
                              onChange={(e) => setLessonNote(e.target.value)}
                              placeholder="Type your notes here..."
                              className="w-full h-[200px] p-4 rounded-xl border border-gray-200 dark:border-[#ffffff1d] bg-gray-50 dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:border-[#37a39a] resize-none"
                            />
                            <div className="flex items-center justify-end mt-4 gap-4">
                              {saveNoteStatus && <span className="text-green-500 text-sm font-medium">{saveNoteStatus}</span>}
                              <button
                                onClick={handleSaveNote}
                                className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:opacity-90 transition"
                              >
                                Save Notes
                              </button>
                            </div>
                          </div>
                        )}

                        {activeTab === "Q&A" && (
                          <div className="mt-4">
                            <LessonQuestions
                              courseId={courseId}
                              lesson={activeLesson}
                              refetchCourseContent={refetch}
                            />
                          </div>
                        )}

                        {activeTab === "Reviews" && (
                          <div className="mt-4">
                            <CourseReview
                              courseId={courseId}
                              course={getCourseObject(data)}
                              refetchCourseContent={refetch}
                            />
                          </div>
                        )}

                        {activeTab === "Quizzes" && (
                          <div className="mt-4">
                            <CourseQuizzes courseId={courseId} />
                          </div>
                        )}

                        {activeTab === "Assignments" && (
                          <div className="mt-4">
                            <CourseAssignments courseId={courseId} />
                          </div>
                        )}

                        {activeTab === "Certificate" && (
                          <div className="mt-4">
                            <CourseCertificate 
                              courseId={courseId} 
                              progressPercentage={progressPercentage} 
                              isCertificateEnabled={getCourseObject(data)?.isCertificateEnabled !== false}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </main>

                {/* Desktop Sidebar (Right Side) */}
                <aside className="hidden 1000px:block h-[calc(100vh-120px)] rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-5 sticky top-[95px] overflow-hidden flex flex-col shadow-sm">
                  <div className="mb-6 flex-shrink-0">
                    <h2 className="text-[20px] font-Poppins font-[700] text-black dark:text-white">
                      Course Content
                    </h2>
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 mb-5">
                      {completedLessonIds.length} of {lessons.length} lessons completed
                    </p>
                    <StudentProgressBar percentage={progressPercentage} height="6px" />
                  </div>

                  <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-custom">
                    {lessons.map((lesson, index) => {
                      const isCompleted = completedLessonIds.includes(lesson.id);
                      const isActive = activeLessonIndex === index;
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLessonIndex(index)}
                          className={`w-full text-left p-4 rounded-xl border transition group flex gap-3 ${
                            isActive
                              ? "bg-[#37a39a]/10 border-[#37a39a] shadow-sm"
                              : "bg-gray-50 dark:bg-slate-800 border-transparent hover:border-gray-300 dark:hover:border-slate-600"
                          }`}
                        >
                          <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${
                            isCompleted 
                              ? "bg-green-500 border-green-500 text-white" 
                              : isActive
                                ? "border-[#37a39a] text-[#37a39a]"
                                : "border-gray-300 dark:border-slate-600 text-transparent"
                          }`}>
                            {isCompleted ? (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            ) : isActive ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#37a39a]" />
                            ) : null}
                          </div>

                          <div className="flex-1">
                            <span className={`block text-[12px] font-semibold tracking-wide uppercase ${isActive ? "text-[#37a39a]" : "text-gray-500"}`}>
                              Lesson {index + 1}
                              {lesson.videoLength ? ` • ${lesson.videoLength} min` : ""}
                            </span>
                            <span className={`block font-Poppins font-[600] mt-1 text-[14px] leading-snug line-clamp-2 ${isActive ? "text-[#37a39a]" : "text-black dark:text-white"}`}>
                              {lesson.title}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </aside>
              </section>
            )}
        </main>
      </div>
    </Protected>
  );
};

export default CourseAccessPage;

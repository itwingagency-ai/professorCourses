"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import Heading from "../../utils/Heading";
import Ratings from "../../utils/Ratings";
import { useGetSingleCourseQuery } from "@/redux/features/courses/coursesApi";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { apiSlice } from "@/redux/features/api/apiSlice";
import { UserLoggedIn } from "@/redux/features/auth/authSlice";

type NormalizedLesson = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoLength?: number | string;
};

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
  reviews: any[];
  reviewsCount: number;
  purchased: number;
  benefits: any[];
  prerequisites: any[];
  lessons: NormalizedLesson[];
  demoUrl?: string;
};

const fallbackImage = "/assests/banner-img-1.png";

const getCourseObject = (data: any): any => {
  if (!data) return null;

  if (data.course) return data.course;
  if (data.data) return data.data;

  return data;
};

const normalizeCourse = (course: any): NormalizedCourse | null => {
  if (!course) return null;

  const id = course?._id || course?.id || "";

  const image =
    course?.thumbnail?.url ||
    course?.thumbnail?.secure_url ||
    course?.thumbnail ||
    course?.image?.url ||
    course?.image ||
    fallbackImage;

  const lessonsSource = Array.isArray(course?.courseData)
    ? course.courseData
    : Array.isArray(course?.lessons)
    ? course.lessons
    : Array.isArray(course?.content)
    ? course.content
    : [];

  const lessons = lessonsSource.map((lesson: any, index: number) => ({
    id: lesson?._id || lesson?.id || `${index}`,
    title: lesson?.title || lesson?.name || `Lesson ${index + 1}`,
    description:
      lesson?.description ||
      lesson?.summary ||
      "Lesson details will be available after enrollment.",
    videoUrl: lesson?.videoUrl || lesson?.video?.url || lesson?.url,
    videoLength: lesson?.videoLength || lesson?.duration,
  }));

  return {
    id,
    title: course?.name || course?.title || "Untitled Course",
    description:
      course?.description ||
      course?.shortDescription ||
      course?.subtitle ||
      "Course details will be updated soon.",
    image,
    category: course?.categories || course?.category || "General",
    level: course?.level || course?.difficulty || "Beginner",
    price: Number(course?.price || 0),
    estimatedPrice:
      course?.estimatedPrice || course?.originalPrice || course?.oldPrice,
    rating: Number(course?.ratings || course?.rating || 0),
    reviews: Array.isArray(course?.reviews) ? course.reviews : [],
    reviewsCount: Array.isArray(course?.reviews)
      ? course.reviews.length
      : Number(course?.reviewsCount || 0),
    purchased: Number(course?.purchased || course?.sold || course?.enrolled || 0),
    benefits: Array.isArray(course?.benefits) ? course.benefits : [],
    prerequisites: Array.isArray(course?.prerequisites)
      ? course.prerequisites
      : [],
    lessons,
    demoUrl:
      course?.demoUrl ||
      course?.demoVideo ||
      course?.demoVideoUrl ||
      course?.courseData?.[0]?.videoUrl,
  };
};

const getPurchasedCourseId = (item: any) => {
  return item?.courseId?._id || item?.courseId || item?._id || item?.id;
};

const CourseDetailsPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const courseId = params?.id as string;

  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  const { user, authChecked } = useSelector((state: any) => state.auth);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetSingleCourseQuery(courseId, {
    skip: !courseId,
  });

  const [createOrder, { isLoading: isEnrolling }] = useCreateOrderMutation();

  const course = useMemo(() => {
    return normalizeCourse(getCourseObject(data));
  }, [data]);

  const isPurchased = useMemo(() => {
    if (!user?.courses || !courseId) return false;

    return user.courses.some((item: any) => {
      const purchasedId = getPurchasedCourseId(item);
      return purchasedId?.toString() === courseId?.toString();
    });
  }, [user, courseId]);

  const refreshCurrentUser = async () => {
    try {
      const result: any = await dispatch(
        apiSlice.endpoints.loadUser.initiate(undefined, {
          forceRefetch: true,
        }) as any
      );

      if (result?.data?.user) {
        dispatch(
          UserLoggedIn({
            accessToken: result.data?.accessToken,
            user: result.data.user,
          })
        );
      }
    } catch (error) {
      console.log("User refresh failed after enrollment:", error);
    }
  };

  const handleMainAction = async () => {
    if (!authChecked) {
      toast.loading("Checking your login status...");
      return;
    }

    if (!user) {
      setRoute("Login");
      setOpen(true);
      toast.error("Please login to enroll in this course.");
      return;
    }

    if (!courseId) {
      toast.error("Invalid course ID.");
      return;
    }

    if (isPurchased) {
      router.push(`/course-access/${courseId}`);
      return;
    }

    try {
      const response: any = await createOrder({
        courseId,
        payment_info: {
          type: "local-mock",
          status: "success",
          source: "frontend-enroll-button",
        },
      }).unwrap();

      if (response?.success) {
        if (response?.alreadyPurchased) {
          toast.success("You are already enrolled in this course.");
        } else {
          toast.success(response?.message || "Course enrolled successfully.");
        }

        if (response?.user) {
          dispatch(
            UserLoggedIn({
              accessToken: response?.accessToken,
              user: response.user,
            })
          );
        } else {
          await refreshCurrentUser();
        }

        await refetch();

        router.push(`/course-access/${courseId}`);
        return;
      }

      toast.error(response?.message || "Enrollment failed. Please try again.");
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Enrollment failed. Please try again.";

      if (
        message.toLowerCase().includes("already") ||
        message.toLowerCase().includes("purchased")
      ) {
        toast.success("You are already enrolled in this course.");
        await refreshCurrentUser();
        router.push(`/course-access/${courseId}`);
        return;
      }

      toast.error(message);
    }
  };

  return (
    <div>
      <Heading
        title={
          course?.title
            ? `${course.title} - 3S Consultant`
            : "Course Details - 3S Consultant"
        }
        description={course?.description || "Course details"}
        keywords="course details, LMS, online learning"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={1}
        setRoute={setRoute}
        route={route}
      />

      <main className="w-[92%] 1000px:w-[85%] mx-auto py-12">
        {(isLoading || isFetching) && (
          <section className="grid grid-cols-1 1000px:grid-cols-[1.35fr_0.65fr] gap-8">
            <div className="space-y-6">
              <div className="h-[260px] 800px:h-[420px] rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-10 w-[80%] rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-5 w-full rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
              <div className="h-5 w-[70%] rounded bg-gray-200 dark:bg-slate-800 animate-pulse" />
            </div>

            <div className="h-[420px] rounded-2xl bg-gray-200 dark:bg-slate-800 animate-pulse" />
          </section>
        )}

        {!isLoading && !isFetching && isError && (
          <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
            <h1 className="text-[28px] font-Poppins font-[700] text-red-500">
              Failed to load course
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mt-3">
              This course may not exist, or the backend server is not responding.
            </p>

            <button
              onClick={() => refetch()}
              className="mt-6 px-8 py-3 rounded-lg bg-[#37a39a] text-white font-semibold hover:opacity-90 transition"
            >
              Try Again
            </button>
          </section>
        )}

        {!isLoading && !isFetching && !isError && !course && (
          <section className="text-center py-20 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
            <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white">
              Course not found
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mt-3">
              The selected course could not be found.
            </p>
          </section>
        )}

        {!isLoading && !isFetching && !isError && course && (
          <section className="grid grid-cols-1 1000px:grid-cols-[1.35fr_0.65fr] gap-8">
            <div>
              <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-[#ffffff1d] bg-white dark:bg-slate-900 shadow-sm">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-[260px] 800px:h-[430px] object-cover"
                  onError={(event) => {
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              </div>

              <div className="mt-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#37a39a] text-white text-[13px] font-semibold">
                    {course.category}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-[#37a39a1a] text-[#37a39a] text-[13px] font-semibold">
                    {course.level}
                  </span>

                  {isPurchased && (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[13px] font-semibold">
                      Enrolled
                    </span>
                  )}
                </div>

                <h1 className="text-[30px] 800px:text-[44px] font-Poppins font-[700] text-black dark:text-white leading-tight">
                  {course.title}
                </h1>

                <p className="text-[16px] text-gray-600 dark:text-gray-300 mt-5 leading-8">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <div className="flex items-center">
                    <Ratings rating={course.rating} />
                    <span className="text-[14px] text-gray-600 dark:text-gray-300 ml-2">
                      ({course.reviewsCount} reviews)
                    </span>
                  </div>

                  <span className="text-[14px] text-gray-600 dark:text-gray-300">
                    {course.purchased} students enrolled
                  </span>
                </div>
              </div>

              {course.demoUrl && (
                <div className="mt-10 rounded-2xl overflow-hidden bg-black border border-gray-200 dark:border-[#ffffff1d]">
                  <video
                    src={course.demoUrl}
                    controls
                    className="w-full aspect-video"
                  />
                </div>
              )}

              <div className="mt-10">
                <h2 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                  What you will learn
                </h2>

                <div className="grid grid-cols-1 800px:grid-cols-2 gap-4 mt-5">
                  {course.benefits.length > 0 ? (
                    course.benefits.map((benefit: any, index: number) => (
                      <div
                        key={benefit?._id || index}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] text-black dark:text-white"
                      >
                        <span className="text-[#37a39a] mr-2">✓</span>
                        {benefit?.title || benefit?.name || benefit}
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] text-gray-600 dark:text-gray-300">
                      Benefits will be added soon.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                  Prerequisites
                </h2>

                <div className="space-y-3 mt-5">
                  {course.prerequisites.length > 0 ? (
                    course.prerequisites.map((item: any, index: number) => (
                      <div
                        key={item?._id || index}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] text-black dark:text-white"
                      >
                        <span className="text-[#37a39a] mr-2">•</span>
                        {item?.title || item?.name || item}
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] text-gray-600 dark:text-gray-300">
                      No prerequisites required.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                  Course Content Preview
                </h2>

                <div className="space-y-3 mt-5">
                  {course.lessons.length > 0 ? (
                    course.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] text-black dark:text-white flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-2"
                      >
                        <div>
                          <span className="text-[#37a39a] font-semibold">
                            Lesson {index + 1}
                          </span>
                          <h3 className="font-Poppins font-[600] mt-1">
                            {lesson.title}
                          </h3>
                          <p className="text-[14px] text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>

                        <span className="text-[13px] text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {lesson.videoLength
                            ? `${lesson.videoLength} min`
                            : isPurchased
                            ? "Available"
                            : "Preview"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] text-gray-600 dark:text-gray-300">
                      Course content preview is not available yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                  Student Reviews
                </h2>

                <div className="space-y-4 mt-5">
                  {course.reviews.length > 0 ? (
                    course.reviews.map((review: any, index: number) => (
                      <div
                        key={review?._id || index}
                        className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-black dark:text-white font-semibold">
                            {review?.user?.name ||
                              review?.name ||
                              "Course Student"}
                          </h3>
                          <Ratings rating={review?.rating || 0} />
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mt-3 leading-7">
                          {review?.comment ||
                            review?.review ||
                            "No review comment provided."}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] text-gray-600 dark:text-gray-300">
                      No reviews yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="h-fit rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] shadow-md p-6 1000px:sticky 1000px:top-[100px]">
              <div className="flex items-end gap-3">
                <span className="text-[36px] font-Poppins font-[700] text-black dark:text-white">
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>

                {course.estimatedPrice && (
                  <span className="text-[18px] line-through text-gray-400 mb-2">
                    ${course.estimatedPrice}
                  </span>
                )}
              </div>

              <button
                onClick={handleMainAction}
                disabled={isEnrolling}
                className={`w-full mt-6 py-4 rounded-lg text-white font-semibold transition ${
                  isEnrolling
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#37a39a] hover:opacity-90"
                }`}
              >
                {isEnrolling
                  ? "Enrolling..."
                  : !user
                  ? "Login to Enroll"
                  : isPurchased
                  ? "Start Learning"
                  : "Enroll Now"}
              </button>

              <div className="mt-6 space-y-4 text-gray-600 dark:text-gray-300">
                <p>✓ Full course access after enrollment</p>
                <p>✓ Learn on mobile and desktop</p>
                <p>✓ Ask questions under lessons</p>
                <p>✓ Add reviews after enrollment</p>
                <p>✓ Lifetime access for enrolled users</p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#ffffff1d]">
                <h3 className="text-[18px] font-semibold text-black dark:text-white">
                  This course includes
                </h3>

                <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                  <li>{course.lessons.length} lessons</li>
                  <li>{course.level} level</li>
                  <li>{course.category} category</li>
                  <li>{course.reviewsCount} reviews</li>
                </ul>
              </div>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
};

export default CourseDetailsPage;

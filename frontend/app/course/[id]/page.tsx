"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
// Conflict resolved
import React, { FC, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Header from "../../components/Header";
import Heading from "../../utils/Heading";
import Ratings from "../../utils/Ratings";
import { useGetSingleCourseQuery } from "@/redux/features/courses/coursesApi";
import { useCreateOrderMutation, useCreatePaymentIntentMutation, useGetEnrollmentStatusQuery } from "@/redux/features/orders/ordersApi";
import { apiSlice } from "@/redux/features/api/apiSlice";
import { UserLoggedIn } from "@/redux/features/auth/authSlice";
import { normalizeSingleCourseResponse } from "@/lib/normalizers";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../../components/Course/CheckOutForm";
import CoursePlayer from "../../utils/CoursePlayer";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock_publishable");

type NormalizedLesson = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoLength?: number | string;
  isFreePreview?: boolean;
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
  language?: string;
  duration?: string;
  targetAudience?: any[];
  courseTags?: string[];
};

const fallbackImage = "/assests/banner-img-1.png";

const getCourseObject = (data: any): any => {
  return normalizeSingleCourseResponse(data) || data;
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
    isFreePreview: lesson?.isFreePreview || false,
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
    benefits: Array.isArray(course?.whatYouWillLearn) && course.whatYouWillLearn.length > 0 
      ? course.whatYouWillLearn 
      : Array.isArray(course?.benefits) 
      ? course.benefits 
      : [],
    prerequisites: Array.isArray(course?.requirements) && course.requirements.length > 0
      ? course.requirements
      : Array.isArray(course?.prerequisites)
      ? course.prerequisites
      : [],
    lessons,
    demoUrl:
      course?.demoUrl ||
      course?.demoVideo ||
      course?.demoVideoUrl ||
      course?.courseData?.[0]?.videoUrl,
    language: course?.language || "English",
    duration: course?.duration || "",
    targetAudience: Array.isArray(course?.targetAudience) ? course.targetAudience : [],
    courseTags: Array.isArray(course?.courseTags) ? course.courseTags : [],
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
  
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | undefined>(undefined);

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
  const [enrollmentSuccessMsg, setEnrollmentSuccessMsg] = React.useState<string | null>(null);

  const course = useMemo(() => {
    return normalizeCourse(getCourseObject(data));
  }, [data]);

  const isPurchased = useMemo(() => {
    if (!user?.courses || !course?.id) return false;

    return user.courses.some((item: any) => {
      const purchasedId = getPurchasedCourseId(item);
      return purchasedId?.toString() === course.id.toString();
    });
  }, [user, course]);

  // Enrollment status from backend (provides enrollmentType, enrolledAt etc.)
  const { data: enrollmentStatusData } = useGetEnrollmentStatusQuery(
    course?.id || "",
    { skip: !user || !course?.id }
  );
  const enrollmentStatus = enrollmentStatusData;

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
      if (process.env.NODE_ENV === "development") {
        console.log("User refresh failed after enrollment:", error);
      }
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

    if (!course?.id) {
      toast.error("Invalid course ID.");
      return;
    }

    if (isPurchased) {
      router.push(`/course-access/${course.id}`);
      return;
    }

    // All courses enroll directly — no Stripe required for free courses
    try {
      const response: any = await createOrder({
        courseId: course.id,
        payment_info: {
          type: "free-enrollment",
          status: "success",
          source: "direct-enrollment",
        },
      }).unwrap();

      if (response?.success) {
        const msg = response?.message || "You have successfully enrolled in this course!";
        toast.success(msg, { duration: 4000, icon: "🎉" });
        setEnrollmentSuccessMsg(msg);

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
        // Brief pause so user sees the success message before redirect
        await new Promise((resolve) => setTimeout(resolve, 1200));
        router.push(`/course-access/${course.id}`);
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
        router.push(`/course-access/${course.id}`);
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

                  {course.language && (
                    <span className="px-3 py-1 rounded-full bg-[#37a39a1a] text-[#37a39a] text-[13px] font-semibold">
                      Language: {course.language}
                    </span>
                  )}

                  {course.duration && (
                    <span className="px-3 py-1 rounded-full bg-[#37a39a1a] text-[#37a39a] text-[13px] font-semibold">
                      Duration: {course.duration}
                    </span>
                  )}

                  {isPurchased && (
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[13px] font-semibold flex items-center gap-1">
                      <span>✓</span> Enrolled
                    </span>
                  )}
                  {isPurchased && enrollmentStatus?.enrollmentType && (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[13px] font-semibold capitalize">
                      {enrollmentStatus.enrollmentType === 'free' ? '🎁 Free' : '💳 Paid'}
                    </span>
                  )}
                </div>

                <h1 className="text-[30px] 800px:text-[44px] font-Poppins font-[700] text-black dark:text-white leading-tight">
                  {course.title}
                </h1>

                {course.courseTags && course.courseTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 mt-2">
                    {course.courseTags.map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-0.5 bg-gray-500/10 text-gray-500 dark:text-gray-400 rounded text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

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

              {(previewVideoUrl || course.demoUrl) && (
                <div className="mt-10 rounded-2xl overflow-hidden bg-black border border-gray-200 dark:border-[#ffffff1d]">
                  <CoursePlayer
                    videoUrl={previewVideoUrl || course.demoUrl || ""}
                    title={course.title}
                    courseId={course.id}
                    contentId=""
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

              {course.targetAudience && course.targetAudience.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
                    Who is this course for?
                  </h2>

                  <div className="space-y-3 mt-5">
                    {course.targetAudience.map((item: any, index: number) => (
                      <div
                        key={item?._id || index}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] text-black dark:text-white"
                      >
                        <span className="text-[#37a39a] mr-2">•</span>
                        {item?.title || item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[#37a39a] font-semibold text-sm">
                              Lesson {index + 1}
                            </span>
                            {lesson.isFreePreview && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <h3 className="font-Poppins font-[600] mt-1">
                            {lesson.title}
                          </h3>
                          <p className="text-[14px] text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {lesson.isFreePreview && !isPurchased && (
                            <button
                              onClick={() => {
                                if (lesson.videoUrl) {
                                  setPreviewVideoUrl(lesson.videoUrl);
                                  window.scrollTo({ top: 350, behavior: "smooth" });
                                } else {
                                  toast.error("Preview video not available");
                                }
                              }}
                              className="px-3 py-1 rounded text-xs font-semibold bg-[#37a39a] hover:bg-[#2e8c84] text-white cursor-pointer transition-colors shadow-sm"
                            >
                              Watch Preview
                            </button>
                          )}
                          <span className="text-[13px] text-gray-500 dark:text-gray-300 whitespace-nowrap">
                            {lesson.videoLength
                              ? `${lesson.videoLength} min`
                              : isPurchased
                              ? "Available"
                              : "Preview"}
                          </span>
                        </div>
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

              {/* Enrollment success banner */}
              {enrollmentSuccessMsg && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <span>{enrollmentSuccessMsg}</span>
                </div>
              )}

              {/* Enrolled status info */}
              {isPurchased && enrollmentStatus?.enrolledAt && (
                <div className="mt-4 p-3 rounded-lg bg-[#37a39a]/5 border border-[#37a39a]/20 text-sm">
                  <p className="text-[#37a39a] font-semibold">✓ You are enrolled</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                    Enrolled on {new Date(enrollmentStatus.enrolledAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              <button
                onClick={handleMainAction}
                disabled={isEnrolling}
                className={`w-full mt-6 py-4 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${
                  isEnrolling
                    ? "bg-gray-400 cursor-not-allowed"
                    : isPurchased
                    ? "bg-[#37a39a] hover:opacity-90"
                    : "bg-[#37a39a] hover:opacity-90 shadow-lg shadow-[#37a39a]/20"
                }`}
              >
                {isEnrolling ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Enrolling...
                  </>
                ) : !user ? (
                  "Login to Enroll"
                ) : isPurchased ? (
                  "→ Start Learning"
                ) : (
                  course.price === 0 ? "🎁 Enroll for Free" : "Enroll Now"
                )}
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

      {openPaymentModal && clientSecret && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080]">
          <div className="bg-white dark:bg-slate-900 w-[90%] 800px:w-[500px] p-8 rounded-lg shadow-xl relative max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-[#ffffff1d]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">Checkout</h2>
              <button onClick={() => setOpenPaymentModal(false)} className="text-black dark:text-white font-bold text-2xl hover:opacity-75">
                ×
              </button>
            </div>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckOutForm 
                setOpen={setOpenPaymentModal} 
                courseId={courseId} 
                onSuccess={async () => {
                  await refreshCurrentUser();
                  await refetch();
                  router.push(`/course-access/${courseId}`);
                }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;

"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import avatarIcon from "../../../public/assests/avatar.png";
import Ratings from "../../utils/Ratings";
import { useAddReviewMutation } from "@/redux/features/courses/coursesApi";

type Props = {
  courseId: string;
  course?: any;
  refetchCourseContent?: () => void;
};

const getReviews = (course: any): any[] => {
  if (Array.isArray(course?.reviews)) return course.reviews;
  if (Array.isArray(course?.course?.reviews)) return course.course.reviews;
  if (Array.isArray(course?.data?.reviews)) return course.data.reviews;
  return [];
};

const getReviewText = (review: any): string => {
  return review?.review || review?.comment || review?.text || "";
};

const getReviewUser = (review: any): any => {
  return review?.user || review?.userId || {};
};

const formatDate = (date?: string | Date) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "";
  }
};

const CourseReview: FC<Props> = ({
  courseId,
  course,
  refetchCourseContent,
}) => {
  const { user } = useSelector((state: any) => state.auth);

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const [addReview, { isLoading }] = useAddReviewMutation();

  const reviews = useMemo(() => getReviews(course), [course]);

  const currentUserReview = useMemo(() => {
    if (!user?._id && !user?.id) return null;

    const userId = (user?._id || user?.id)?.toString();

    return reviews.find((item: any) => {
      const reviewUser = getReviewUser(item);
      const reviewUserId =
        reviewUser?._id || reviewUser?.id || item?.user?._id || item?.user;

      return reviewUserId?.toString() === userId;
    });
  }, [reviews, user]);

  const handleSubmit = async () => {
    const trimmedReview = review.trim();

    if (!user) {
      toast.error("Please login to add a review.");
      return;
    }

    if (!courseId) {
      toast.error("Course information is missing.");
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a rating from 1 to 5.");
      return;
    }

    if (!trimmedReview) {
      toast.error("Please write your review first.");
      return;
    }

    if (trimmedReview.length < 5) {
      toast.error("Review is too short.");
      return;
    }

    try {
      const response: any = await addReview({
        courseId,
        rating,
        review: trimmedReview,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Review submitted successfully.");
        setReview("");
        setRating(5);

        if (refetchCourseContent) {
          refetchCourseContent();
        }

        return;
      }

      toast.error(response?.message || "Failed to submit review.");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          "Failed to submit review."
      );
    }
  };

  return (
    <div className="mt-6 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-[#ffffff1d]">
      <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-Poppins font-[700] text-black dark:text-white">
            Reviews
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Share your learning experience after enrolling in this course.
          </p>
        </div>

        <span className="text-[14px] text-gray-500 dark:text-gray-300">
          {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </span>
      </div>

      {currentUserReview && (
        <div className="mt-5 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
          <p className="text-green-700 dark:text-green-300 font-semibold">
            You have already reviewed this course.
          </p>
          <p className="text-green-700 dark:text-green-300 text-[14px] mt-1">
            If backend supports review update, submitting again may update your review; otherwise it may be rejected.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-4">
        <div className="flex items-start gap-3">
          <Image
            src={user?.avatar?.url || avatarIcon}
            alt="avatar"
            width={42}
            height={42}
            className="w-[42px] h-[42px] rounded-full object-cover"
          />

          <div className="flex-1">
            <div className="flex flex-col 800px:flex-row 800px:items-center gap-3 mb-4">
              <p className="text-black dark:text-white font-semibold">
                Your rating:
              </p>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRating(item)}
                    className={`text-[28px] leading-none transition ${
                      item <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <span className="text-[14px] text-gray-500 dark:text-gray-300">
                {rating}/5
              </span>
            </div>

            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Write your review about this course..."
              className="w-full min-h-[120px] p-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a] resize-none"
            />

            <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-3 mt-3">
              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                Keep it honest and helpful for future students.
              </p>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-7 py-3 rounded-lg text-white font-semibold transition ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#37a39a] hover:opacity-90"
                }`}
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="mt-6 text-center py-10 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
          <h3 className="text-[20px] font-Poppins font-[600] text-black dark:text-white">
            No reviews yet
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Be the first enrolled student to review this course.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {reviews.map((item: any, index: number) => {
            const reviewUser = getReviewUser(item);

            return (
              <div
                key={item?._id || index}
                className="rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-5"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={reviewUser?.avatar?.url || avatarIcon}
                    alt="review user"
                    width={42}
                    height={42}
                    className="w-[42px] h-[42px] rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-2">
                      <div>
                        <h3 className="font-Poppins font-[600] text-black dark:text-white">
                          {reviewUser?.name || item?.name || "Student"}
                        </h3>

                        {item?.createdAt && (
                          <span className="text-[12px] text-gray-500 dark:text-gray-400">
                            {formatDate(item.createdAt)}
                          </span>
                        )}
                      </div>

                      <Ratings rating={item?.rating || 0} />
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mt-3 leading-7">
                      {getReviewText(item) || "No review comment provided."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseReview;

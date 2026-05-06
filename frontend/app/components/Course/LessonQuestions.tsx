"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import avatarIcon from "../../../public/assests/avatar.png";
import { useAddQuestionMutation } from "@/redux/features/courses/coursesApi";

type Props = {
  courseId: string;
  lesson: any;
  refetchCourseContent?: () => void;
};

const getQuestionText = (question: any) => {
  return question?.question || question?.text || question?.title || "";
};

const getQuestionUser = (question: any) => {
  return question?.user || question?.userId || {};
};

const getReplies = (question: any) => {
  if (Array.isArray(question?.questionReplies)) return question.questionReplies;
  if (Array.isArray(question?.replies)) return question.replies;
  if (Array.isArray(question?.answers)) return question.answers;
  return [];
};

const formatDate = (date?: string | Date) => {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return "";
  }
};

const LessonQuestions: FC<Props> = ({
  courseId,
  lesson,
  refetchCourseContent,
}) => {
  const { user } = useSelector((state: any) => state.auth);
  const [question, setQuestion] = useState("");

  const [addQuestion, { isLoading }] = useAddQuestionMutation();

  const lessonId = lesson?._id || lesson?.id;

  const questions = useMemo(() => {
    return Array.isArray(lesson?.questions) ? lesson.questions : [];
  }, [lesson]);

  const handleSubmit = async () => {
    const trimmedQuestion = question.trim();

    if (!user) {
      toast.error("Please login to ask a question.");
      return;
    }

    if (!courseId || !lessonId) {
      toast.error("Course or lesson information is missing.");
      return;
    }

    if (!trimmedQuestion) {
      toast.error("Please write your question first.");
      return;
    }

    if (trimmedQuestion.length < 5) {
      toast.error("Question is too short.");
      return;
    }

    try {
      const response: any = await addQuestion({
        courseId,
        contentId: lessonId,
        question: trimmedQuestion,
      }).unwrap();

      if (response?.success) {
        toast.success(response?.message || "Question added successfully.");
        setQuestion("");

        if (refetchCourseContent) {
          refetchCourseContent();
        }

        return;
      }

      toast.error(response?.message || "Failed to add question.");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          "Failed to add question."
      );
    }
  };

  return (
    <div className="mt-10 p-5 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-[#ffffff1d]">
      <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-3">
        <div>
          <h2 className="text-[24px] font-Poppins font-[700] text-black dark:text-white">
            Questions
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Ask questions about this lesson and view discussion replies.
          </p>
        </div>

        <span className="text-[14px] text-gray-500 dark:text-gray-300">
          {questions.length} question{questions.length === 1 ? "" : "s"}
        </span>
      </div>

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
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Write your question about this lesson..."
              className="w-full min-h-[110px] p-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a] resize-none"
            />

            <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-3 mt-3">
              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                Be clear and specific so the instructor can reply properly.
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
                {isLoading ? "Submitting..." : "Ask Question"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="mt-6 text-center py-10 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]">
          <h3 className="text-[20px] font-Poppins font-[600] text-black dark:text-white">
            No questions yet
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Be the first student to ask a question for this lesson.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {questions.map((item: any, index: number) => {
            const questionUser = getQuestionUser(item);
            const replies = getReplies(item);

            return (
              <div
                key={item?._id || index}
                className="rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-5"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={questionUser?.avatar?.url || avatarIcon}
                    alt="student"
                    width={42}
                    height={42}
                    className="w-[42px] h-[42px] rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-1">
                      <h3 className="font-Poppins font-[600] text-black dark:text-white">
                        {questionUser?.name || item?.name || "Student"}
                      </h3>

                      {item?.createdAt && (
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                          {formatDate(item.createdAt)}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mt-3 leading-7">
                      {getQuestionText(item)}
                    </p>
                  </div>
                </div>

                {replies.length > 0 && (
                  <div className="mt-5 ml-0 800px:ml-[55px] space-y-3">
                    <p className="text-[14px] font-semibold text-[#37a39a]">
                      Replies
                    </p>

                    {replies.map((reply: any, replyIndex: number) => {
                      const replyUser = reply?.user || reply?.userId || {};

                      return (
                        <div
                          key={reply?._id || replyIndex}
                          className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-[#ffffff1d]"
                        >
                          <div className="flex items-start gap-3">
                            <Image
                              src={replyUser?.avatar?.url || avatarIcon}
                              alt="reply user"
                              width={34}
                              height={34}
                              className="w-[34px] h-[34px] rounded-full object-cover"
                            />

                            <div className="flex-1">
                              <div className="flex flex-col 800px:flex-row 800px:items-center 800px:justify-between gap-1">
                                <h4 className="text-[14px] font-semibold text-black dark:text-white">
                                  {replyUser?.name ||
                                    reply?.name ||
                                    "Instructor"}
                                </h4>

                                {reply?.createdAt && (
                                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                )}
                              </div>

                              <p className="text-[14px] text-gray-600 dark:text-gray-300 mt-2 leading-6">
                                {reply?.answer ||
                                  reply?.reply ||
                                  reply?.text ||
                                  "Reply content unavailable."}
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
          })}
        </div>
      )}
    </div>
  );
};

export default LessonQuestions;

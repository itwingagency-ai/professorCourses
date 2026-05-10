/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import { format } from "timeago.js";

type Props = {
  questions: any[];
};

const StudentQuestionsList: FC<Props> = ({ questions }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] rounded-2xl shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">You haven't asked any questions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((q, index) => (
        <div
          key={q.questionId || index}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] rounded-2xl shadow-sm p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-Poppins font-semibold text-[16px] text-[#37a39a]">
                Course: {q.courseName}
              </h3>
              <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                Lesson: {q.lessonTitle} â€¢ {format(q.createdAt)}
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
              {q.questionReplies?.length || 0} Replies
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-[#ffffff1d]">
            <p className="text-black dark:text-white text-sm">{q.question}</p>
          </div>

          {q.questionReplies && q.questionReplies.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200 dark:border-slate-700">
              {q.questionReplies.map((reply: any, rIndex: number) => (
                <div key={rIndex} className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-[#ffffff1d]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] font-semibold text-[#37a39a]">
                      {reply.user?.role === "admin" ? "Instructor" : "Student"}
                    </span>
                    <span className="text-[11px] text-gray-500">{format(reply.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-[13px]">{reply.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentQuestionsList;

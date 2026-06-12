'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import { useGetTeacherQuestionsQuery, useAddTeacherAnswerMutation } from '@/redux/features/teacher/teacherApi'
import toast from 'react-hot-toast'

type Props = {}

const TeacherQuestionsPage: FC<Props> = () => {
  const { data, isLoading, refetch } = useGetTeacherQuestionsQuery({})
  const [addAnswer, { isLoading: isAnswering }] = useAddTeacherAnswerMutation()
  const questions = data?.questions || []

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState<Record<string, string>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)

  const handleAnswer = async (question: any) => {
    const text = answerText[question._id]?.trim()
    if (!text) {
      toast.error('Please type an answer first')
      return
    }
    setSubmittingId(question._id)
    try {
      await addAnswer({
        questionId: question._id,
        answer: text,
        courseId: question.courseId,
        contentId: question.contentId,
      }).unwrap()
      toast.success('Answer submitted!')
      setAnswerText((prev) => ({ ...prev, [question._id]: '' }))
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to submit answer')
    } finally {
      setSubmittingId(null)
    }
  }

  return (
    <TeacherProtected>
      <Heading
        title="Questions - Teacher Dashboard"
        description="View and answer student questions"
        keywords="teacher, questions, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">
            <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white mb-8">
              Student Questions
            </h1>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                <p className="text-gray-500 dark:text-gray-400">No questions from students yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q: any) => (
                  <div key={q._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] shadow-sm p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-[#37a39a]">{q.courseName}</span>
                          <span className="text-xs text-gray-400">›</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{q.contentTitle}</span>
                          <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            q.questionReplies?.length > 0
                              ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-800'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                          }`}>
                            {q.questionReplies?.length > 0 ? 'Answered' : 'Unanswered'}
                          </span>
                        </div>
                        <p className="text-black dark:text-white font-medium leading-relaxed">{q.question}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          By: <span className="font-semibold">{q.user?.name || 'Student'}</span>
                        </p>

                        {/* Existing replies */}
                        {q.questionReplies?.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {q.questionReplies.map((reply: any, i: number) => (
                              <div key={i} className="pl-4 border-l-2 border-[#37a39a] py-2">
                                <p className="text-sm text-gray-700 dark:text-gray-200">{reply.answer}</p>
                                <p className="text-xs text-gray-400 mt-1">— {reply.user?.name || 'Teacher'}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedId(expandedId === q._id ? null : q._id)}
                        className="text-sm text-[#37a39a] font-semibold border border-[#37a39a] px-4 py-2 rounded-lg hover:bg-[#37a39a] hover:text-white transition whitespace-nowrap"
                      >
                        {expandedId === q._id ? 'Cancel' : 'Answer'}
                      </button>
                    </div>

                    {/* Answer form */}
                    {expandedId === q._id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#ffffff1d]">
                        <textarea
                          value={answerText[q._id] || ''}
                          onChange={(e) => setAnswerText((prev) => ({ ...prev, [q._id]: e.target.value }))}
                          placeholder="Type your answer here..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-200 dark:border-[#ffffff1d] rounded-lg bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#37a39a] resize-none"
                        />
                        <button
                          onClick={() => handleAnswer(q)}
                          disabled={isAnswering && submittingId === q._id}
                          className="mt-3 px-6 py-2 bg-[#37a39a] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                        >
                          {isAnswering && submittingId === q._id ? 'Submitting...' : 'Submit Answer'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherQuestionsPage

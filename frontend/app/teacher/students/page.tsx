'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import { useGetTeacherCourseStudentsQuery, useGetTeacherCoursesQuery } from '@/redux/features/teacher/teacherApi'
import { useState } from 'react'

type Props = {}

const TeacherStudentsPage: FC<Props> = () => {
  const { data: coursesData, isLoading: coursesLoading } = useGetTeacherCoursesQuery({})
  const courses = coursesData?.courses || []

  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const courseId = selectedCourse || (courses[0]?._id || '')

  const { data: studentsData, isLoading: studentsLoading } = useGetTeacherCourseStudentsQuery(courseId, {
    skip: !courseId,
  })
  const students = studentsData?.students || []

  return (
    <TeacherProtected>
      <Heading
        title="Students - Teacher Dashboard"
        description="View students enrolled in your courses"
        keywords="teacher, students, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">
            <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white mb-6">
              Students
            </h1>

            {/* Course selector */}
            {!coursesLoading && courses.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Filter by Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-[#ffffff1d] bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#37a39a]"
                >
                  {courses.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            {coursesLoading || studentsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                <p className="text-gray-500 dark:text-gray-400">You have no courses yet. Create one to see your students.</p>
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                <p className="text-gray-500 dark:text-gray-400">No students enrolled in this course yet.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="border-b border-gray-200 dark:border-[#ffffff1d] bg-gray-50 dark:bg-slate-800">
                      <tr>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Name</th>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Email</th>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Role</th>
                        <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-[#ffffff0d]">
                      {students.map((student: any) => (
                        <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-[#37a39a] flex items-center justify-center text-white font-bold text-sm">
                                {student.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-black dark:text-white font-medium">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{student.email}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize">
                              {student.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                            {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherStudentsPage

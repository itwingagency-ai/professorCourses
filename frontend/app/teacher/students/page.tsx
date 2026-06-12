'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useMemo, useState } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import {
  useGetTeacherCourseStudentsQuery,
  useGetTeacherCoursesQuery,
} from '@/redux/features/teacher/teacherApi'

const TeacherStudentsPage: FC = () => {
  const { data: coursesData, isLoading: coursesLoading } = useGetTeacherCoursesQuery({})
  const courses: any[] = useMemo(() => coursesData?.courses || [], [coursesData])

  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [search, setSearch] = useState('')

  const effectiveCourseId = selectedCourseId || courses[0]?._id || ''

  const { data: studentsData, isLoading: studentsLoading } =
    useGetTeacherCourseStudentsQuery(effectiveCourseId, {
      skip: !effectiveCourseId,
    })

  const students: any[] = useMemo(() => studentsData?.students || [], [studentsData])

  const selectedCourseName = useMemo(() => {
    const found = courses.find((c) => c._id === effectiveCourseId)
    return found?.name || ''
  }, [courses, effectiveCourseId])

  const filteredStudents = useMemo(() => {
    if (!search.trim()) return students
    const kw = search.toLowerCase()
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(kw) ||
        s.email?.toLowerCase().includes(kw)
    )
  }, [students, search])

  const isLoading = coursesLoading || studentsLoading

  return (
    <TeacherProtected>
      <Heading
        title="Enrolled Students - Teacher Dashboard"
        description="View students enrolled in your courses"
        keywords="teacher, students, enrollment, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">

            {/* Header */}
            <div className="flex flex-col 800px:flex-row 800px:items-end 800px:justify-between gap-4 mb-8">
              <div>
                <p className="text-[#37a39a] font-Poppins font-[600] mb-1 text-sm">
                  Course Management
                </p>
                <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white">
                  Enrolled Students
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  {selectedCourseName && `Showing enrollments for: ${selectedCourseName}`}
                </p>
              </div>

              {/* Stats summary */}
              {!isLoading && courses.length > 0 && (
                <div className="flex gap-4">
                  <div className="px-5 py-3 rounded-xl bg-[#37a39a]/10 border border-[#37a39a]/20 text-center">
                    <p className="text-[22px] font-Poppins font-[700] text-[#37a39a]">
                      {students.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Enrolled
                    </p>
                  </div>
                  <div className="px-5 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                    <p className="text-[22px] font-Poppins font-[700] text-purple-500">
                      {courses.length}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Your Courses
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Filters */}
            {!coursesLoading && courses.length > 0 && (
              <div className="flex flex-col 800px:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                    Select Course
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-[#ffffff1d] bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#37a39a] text-sm"
                  >
                    {courses.map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.name}{' '}
                        {c.purchased != null ? `(${c.purchased} enrolled)` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                    Search Students
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-[#ffffff1d] bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#37a39a] text-sm"
                  />
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* No courses state */}
            {!isLoading && courses.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                <div className="text-5xl mb-4">📚</div>
                <h2 className="text-[22px] font-Poppins font-[700] text-black dark:text-white">
                  No Courses Yet
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-[380px] mx-auto">
                  Create your first course to start tracking enrolled students.
                </p>
              </div>
            )}

            {/* No students state */}
            {!isLoading && courses.length > 0 && students.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                <div className="text-5xl mb-4">👩‍🎓</div>
                <h2 className="text-[22px] font-Poppins font-[700] text-black dark:text-white">
                  No Students Enrolled
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-[380px] mx-auto">
                  No students have enrolled in this course yet. Share your course to attract learners!
                </p>
              </div>
            )}

            {/* Search no results */}
            {!isLoading &&
              students.length > 0 &&
              filteredStudents.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                  <p className="text-gray-500 dark:text-gray-400">
                    No students match your search.
                  </p>
                  <button
                    onClick={() => setSearch('')}
                    className="mt-4 px-5 py-2 rounded-lg bg-[#37a39a] text-white text-sm font-semibold"
                  >
                    Clear Search
                  </button>
                </div>
              )}

            {/* Students table */}
            {!isLoading && filteredStudents.length > 0 && (
              <>
                <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-semibold text-black dark:text-white">{filteredStudents.length}</span> of{' '}
                  <span className="font-semibold text-black dark:text-white">{students.length}</span> students
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="border-b border-gray-200 dark:border-[#ffffff1d] bg-gray-50 dark:bg-slate-800">
                        <tr>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            #
                          </th>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Student
                          </th>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Email
                          </th>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Course
                          </th>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Progress %
                          </th>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Lessons
                          </th>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Last Activity
                          </th>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Enrolled Date
                          </th>
                          <th className="px-6 py-4 text-gray-600 dark:text-gray-300 font-semibold">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-[#ffffff0d]">
                        {filteredStudents.map((student: any, index: number) => (
                          <tr
                            key={student._id}
                            className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition"
                          >
                            <td className="px-6 py-4 text-gray-400 dark:text-gray-500 text-xs">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#37a39a] to-[#2b857d] flex items-center justify-center text-white font-bold text-sm shrink-0">
                                  {student.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <span className="text-black dark:text-white font-medium">
                                  {student.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                              {student.email}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 truncate max-w-[150px]" title={selectedCourseName}>
                              {selectedCourseName}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#37a39a]"
                                    style={{ width: `${student.progress?.progressPercentage || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                                  {Math.round(student.progress?.progressPercentage || 0)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs">
                              {student.progress?.completedLessons?.length || 0} / {student.progress?.totalLessons || 0}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs">
                              {student.progress?.updatedAt
                                ? new Date(student.progress.updatedAt).toLocaleDateString()
                                : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs">
                              {student.enrolledAt
                                ? new Date(student.enrolledAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })
                                : 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                  student.status === 'active'
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                    : student.status === 'blocked'
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                                }`}
                              >
                                {student.status || 'active'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table footer */}
                  <div className="px-6 py-3 border-t border-gray-100 dark:border-[#ffffff0d] bg-gray-50 dark:bg-slate-800/50 text-xs text-gray-500 dark:text-gray-400">
                    Total: {students.length} student{students.length === 1 ? '' : 's'} enrolled in "{selectedCourseName}"
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default TeacherStudentsPage

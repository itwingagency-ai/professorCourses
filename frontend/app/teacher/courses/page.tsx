'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from 'react'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import { useGetTeacherCoursesQuery, useDeleteTeacherCourseMutation } from '@/redux/features/teacher/teacherApi'
import SafeCourseImage from '@/app/components/SafeCourseImage'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Props = {}

const TeacherCoursesPage: FC<Props> = () => {
  const { data, isLoading, refetch } = useGetTeacherCoursesQuery({})
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteTeacherCourseMutation()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const courses = data?.courses || []

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return
    setDeletingId(id)
    try {
      await deleteCourse(id).unwrap()
      toast.success('Course deleted successfully')
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete course')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <TeacherProtected>
      <Heading
        title="My Courses - Teacher Dashboard"
        description="Manage your courses"
        keywords="teacher, courses, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white">
                My Courses
              </h1>
              <Link href="/teacher/create-course">
                <button className="px-6 py-3 bg-[#37a39a] text-white rounded-lg font-semibold hover:opacity-90 transition">
                  + Create Course
                </button>
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 800px:grid-cols-2 1200px:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d]">
                <p className="text-[18px] text-gray-500 dark:text-gray-400 mb-6">You have not created any courses yet.</p>
                <Link href="/teacher/create-course">
                  <button className="px-8 py-3 bg-[#37a39a] text-white rounded-lg font-semibold hover:opacity-90 transition">
                    Create Your First Course
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 800px:grid-cols-2 1200px:grid-cols-3 gap-6">
                {courses.map((course: any) => (
                  <div key={course._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] shadow-sm overflow-hidden flex flex-col">
                    <div className="w-full h-40 overflow-hidden">
                      <SafeCourseImage
                        src={course.thumbnail?.url || course.thumbnail}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          course.status === 'published' ? 'bg-green-100 text-green-700' : 
                          course.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                          course.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {course.status || 'published'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{course.category}</span>
                      </div>
                      <h3 className="text-[16px] font-Poppins font-semibold text-black dark:text-white mb-1 line-clamp-2">{course.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{course.level} • {course.purchased || 0} students</p>
                      <p className="text-[#37a39a] font-bold text-[18px] mb-4">{course.price === 0 ? 'Free' : `$${course.price}`}</p>
                      {course.status === 'rejected' && course.rejectionReason && (
                        <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400">
                          <strong className="block mb-1">Rejection Reason:</strong>
                          {course.rejectionReason}
                        </div>
                      )}

                      <div className="flex gap-3 mt-auto">
                        <Link href={`/teacher/edit-course/${course._id}`} className="flex-1">
                          <button className="w-full py-2 border border-[#37a39a] text-[#37a39a] rounded-lg text-sm font-semibold hover:bg-[#37a39a] hover:text-white transition">
                            Edit
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id, course.name)}
                          disabled={isDeleting && deletingId === course._id}
                          className="flex-1 py-2 border border-red-400 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                        >
                          {isDeleting && deletingId === course._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
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

export default TeacherCoursesPage

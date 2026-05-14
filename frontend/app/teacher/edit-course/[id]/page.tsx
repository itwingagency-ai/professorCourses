'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import TeacherProtected from '@/app/hooks/teacherProtected'
import TeacherSideBar from '@/app/components/Teacher/sidebar/TeacherSideBar'
import TeacherDashboardHeader from '@/app/components/Teacher/TeacherDashboardHeader'
import Heading from '@/app/utils/Heading'
import { useGetTeacherCoursesQuery, useEditTeacherCourseMutation } from '@/redux/features/teacher/teacherApi'
import toast from 'react-hot-toast'
import { styles } from '@/app/styles/style'

type Props = {}

const EditCoursePage: FC<Props> = () => {
  const params = useParams()
  const router = useRouter()
  const courseId = params?.id as string

  const { data, isLoading } = useGetTeacherCoursesQuery({})
  const [editCourse, { isLoading: isSaving }] = useEditTeacherCourseMutation()

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    estimatedPrice: '',
    tags: '',
    level: '',
    category: '',
    demoUrl: '',
    status: 'published',
  })

  // Hydrate form from courses list
  useEffect(() => {
    if (data?.courses && courseId) {
      const course = data.courses.find((c: any) => c._id === courseId)
      if (course) {
        setForm({
          name: course.name || '',
          description: course.description || '',
          price: String(course.price || ''),
          estimatedPrice: String(course.estimatedPrice || ''),
          tags: course.tags || '',
          level: course.level || '',
          category: course.category || '',
          demoUrl: course.demoUrl || '',
          status: course.status || 'published',
        })
      }
    }
  }, [data, courseId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await editCourse({
        id: courseId,
        data: {
          ...form,
          price: Number(form.price) || 0,
          estimatedPrice: form.estimatedPrice ? Number(form.estimatedPrice) : undefined,
        },
      }).unwrap()
      toast.success('Course updated successfully')
      router.push('/teacher/courses')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update course')
    }
  }

  return (
    <TeacherProtected>
      <Heading
        title="Edit Course - Teacher Dashboard"
        description="Edit your course details"
        keywords="teacher, edit course, LMS"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <TeacherSideBar />
        </div>
        <div className="w-[85%] flex flex-col">
          <TeacherDashboardHeader />
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 mb-8">
              <button onClick={() => router.back()} className="text-gray-500 hover:text-black dark:hover:text-white transition">
                ← Back
              </button>
              <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white">
                Edit Course
              </h1>
            </div>

            {isLoading ? (
              <div className="space-y-4 max-w-2xl">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-[#ffffff1d] shadow-sm p-8 space-y-5">

                  <div>
                    <label className={styles.label}>Course Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`${styles.input} border border-gray-200 dark:border-[#ffffff1d]`}
                      placeholder="e.g. Complete React Development"
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Description *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={`${styles.input} !h-auto !py-3 border border-gray-200 dark:border-[#ffffff1d]`}
                      placeholder="Describe what students will learn..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={styles.label}>Price ($) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        className={`${styles.input} border border-gray-200 dark:border-[#ffffff1d]`}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className={styles.label}>Estimated Price (optional)</label>
                      <input
                        type="number"
                        min="0"
                        value={form.estimatedPrice}
                        onChange={(e) => setForm({ ...form, estimatedPrice: e.target.value })}
                        className={`${styles.input} border border-gray-200 dark:border-[#ffffff1d]`}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={styles.label}>Category *</label>
                    <input
                      type="text"
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className={`${styles.input} border border-gray-200 dark:border-[#ffffff1d]`}
                      placeholder="Web Development, Data Science, etc."
                    />
                  </div>

                  <div>
                    <label className={styles.label}>Tags *</label>
                    <input
                      type="text"
                      required
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className={`${styles.input} border border-gray-200 dark:border-[#ffffff1d]`}
                      placeholder="React, JavaScript, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={styles.label}>Level *</label>
                      <input
                        type="text"
                        required
                        value={form.level}
                        onChange={(e) => setForm({ ...form, level: e.target.value })}
                        className={`${styles.input} border border-gray-200 dark:border-[#ffffff1d]`}
                        placeholder="Beginner / Intermediate / Expert"
                      />
                    </div>
                    <div>
                      <label className={styles.label}>Demo URL *</label>
                      <input
                        type="text"
                        required
                        value={form.demoUrl}
                        onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                        className={`${styles.input} border border-gray-200 dark:border-[#ffffff1d]`}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className={styles.label}>Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className={`${styles.input} border border-gray-200 dark:border-[#ffffff1d]`}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#37a39a] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/teacher/courses')}
                    className="px-8 py-3 border border-gray-300 dark:border-[#ffffff1d] text-black dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </TeacherProtected>
  )
}

export default EditCoursePage

/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiSlice } from "../api/apiSlice";

export const teacherApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard
    getTeacherDashboard: builder.query({
      query: () => ({
        url: "teacher/dashboard",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Courses"],
    }),

    // Get teacher's own courses
    getTeacherCourses: builder.query({
      query: () => ({
        url: "teacher/courses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Courses"],
    }),

    // Create course as teacher
    createTeacherCourse: builder.mutation({
      query: (data: any) => ({
        url: "teacher/courses",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Edit teacher's own course
    editTeacherCourse: builder.mutation({
      query: ({ id, data }: { id: string; data: any }) => ({
        url: `teacher/courses/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Delete teacher's own course
    deleteTeacherCourse: builder.mutation({
      query: (id: string) => ({
        url: `teacher/courses/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Get students enrolled in a specific course
    getTeacherCourseStudents: builder.query({
      query: (courseId: string) => ({
        url: `teacher/courses/${courseId}/students`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Get all orders for teacher's courses
    getTeacherOrders: builder.query({
      query: () => ({
        url: "teacher/orders",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Get all questions across teacher's courses
    getTeacherQuestions: builder.query({
      query: () => ({
        url: "teacher/questions",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Answer a question
    addTeacherAnswer: builder.mutation({
      query: ({
        questionId,
        answer,
        courseId,
        contentId,
      }: {
        questionId: string;
        answer: string;
        courseId: string;
        contentId: string;
      }) => ({
        url: `teacher/questions/${questionId}/answer`,
        method: "POST",
        body: { answer, courseId, contentId },
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTeacherDashboardQuery,
  useGetTeacherCoursesQuery,
  useCreateTeacherCourseMutation,
  useEditTeacherCourseMutation,
  useDeleteTeacherCourseMutation,
  useGetTeacherCourseStudentsQuery,
  useGetTeacherOrdersQuery,
  useGetTeacherQuestionsQuery,
  useAddTeacherAnswerMutation,
} = teacherApi;

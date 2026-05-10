import { apiSlice } from "../api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentDashboard: builder.query<any, void>({
      query: () => "/student/dashboard",
      providesTags: ["StudentProgress"],
    }),
    getStudentOrders: builder.query<any, void>({
      query: () => "/student/my-orders",
    }),
    getStudentQuestions: builder.query<any, void>({
      query: () => "/student/my-questions",
    }),
    getStudentProgress: builder.query<any, string>({
      query: (courseId) => `/student/progress/${courseId}`,
      providesTags: (result, error, courseId) => [{ type: "StudentProgress", id: courseId }],
    }),
    markLessonComplete: builder.mutation<any, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) => ({
        url: "/student/progress/mark-complete",
        method: "POST",
        body: { courseId, lessonId },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "StudentProgress", id: courseId },
        "StudentProgress",
      ],
    }),
    saveLastLesson: builder.mutation<any, { courseId: string; lessonId: string }>({
      query: ({ courseId, lessonId }) => ({
        url: "/student/progress/last-lesson",
        method: "POST",
        body: { courseId, lessonId },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "StudentProgress", id: courseId },
      ],
    }),
  }),
});

export const {
  useGetStudentDashboardQuery,
  useGetStudentOrdersQuery,
  useGetStudentQuestionsQuery,
  useGetStudentProgressQuery,
  useMarkLessonCompleteMutation,
  useSaveLastLessonMutation,
} = studentApi;

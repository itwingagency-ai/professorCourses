import { apiSlice } from "../api/apiSlice";

export const quizApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzesByCourse: builder.query<any, string>({
      query: (courseId) => ({
        url: `quiz/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
    getQuizAttempts: builder.query<any, string>({
      query: (quizId) => ({
        url: `quiz/attempts/${quizId}`,
        method: "GET",
      }),
      providesTags: ["QuizAttempt"],
    }),
    submitQuizAttempt: builder.mutation<any, { quizId: string; responses: any[] }>({
      query: ({ quizId, responses }) => ({
        url: `quiz/attempt/${quizId}`,
        method: "POST",
        body: { responses },
      }),
      invalidatesTags: ["QuizAttempt"],
    }),
    createQuiz: builder.mutation<any, any>({
      query: (body) => ({
        url: `quiz/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quiz"],
    }),
    editQuiz: builder.mutation<any, { quizId: string; body: any }>({
      query: ({ quizId, body }) => ({
        url: `quiz/edit/${quizId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Quiz"],
    }),
    deleteQuiz: builder.mutation<any, string>({
      query: (quizId) => ({
        url: `quiz/delete/${quizId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz", "QuizAttempt"],
    }),
  }),
});

export const {
  useGetQuizzesByCourseQuery,
  useGetQuizAttemptsQuery,
  useSubmitQuizAttemptMutation,
  useCreateQuizMutation,
  useEditQuizMutation,
  useDeleteQuizMutation,
} = quizApi;

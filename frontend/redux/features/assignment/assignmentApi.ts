import { apiSlice } from "../api/apiSlice";

export const assignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignmentsByCourse: builder.query<any, string>({
      query: (courseId) => ({
        url: `assignment/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
    getStudentSubmission: builder.query<any, string>({
      query: (assignmentId) => ({
        url: `assignment/submission/${assignmentId}`,
        method: "GET",
      }),
      providesTags: ["AssignmentSubmission"],
    }),
    submitAssignment: builder.mutation<
      any,
      { assignmentId: string; submissionText?: string; submissionFileUrl?: string }
    >({
      query: ({ assignmentId, submissionText, submissionFileUrl }) => ({
        url: `assignment/submit/${assignmentId}`,
        method: "POST",
        body: { submissionText, submissionFileUrl },
      }),
      invalidatesTags: ["AssignmentSubmission"],
    }),
    createAssignment: builder.mutation<any, any>({
      query: (body) => ({
        url: `assignment/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Assignment"],
    }),
    editAssignment: builder.mutation<any, { assignmentId: string; body: any }>({
      query: ({ assignmentId, body }) => ({
        url: `assignment/edit/${assignmentId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Assignment"],
    }),
    deleteAssignment: builder.mutation<any, string>({
      query: (assignmentId) => ({
        url: `assignment/delete/${assignmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment", "AssignmentSubmission"],
    }),
    getAllSubmissionsForAssignment: builder.query<any, string>({
      query: (assignmentId) => ({
        url: `assignment/submissions/${assignmentId}`,
        method: "GET",
      }),
      providesTags: ["AssignmentSubmission"],
    }),
    gradeAssignment: builder.mutation<any, { submissionId: string; body: any }>({
      query: ({ submissionId, body }) => ({
        url: `assignment/grade/${submissionId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AssignmentSubmission"],
    }),
  }),
});

export const {
  useGetAssignmentsByCourseQuery,
  useGetStudentSubmissionQuery,
  useSubmitAssignmentMutation,
  useCreateAssignmentMutation,
  useEditAssignmentMutation,
  useDeleteAssignmentMutation,
  useGetAllSubmissionsForAssignmentQuery,
  useGradeAssignmentMutation,
} = assignmentApi;

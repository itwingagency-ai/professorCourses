/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    getAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Courses"],
    }),

    getSingleCourse: builder.query({
      query: (id) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_result, _error, id) => [{ type: "Course", id }],
    }),

    getCourseContent: builder.query({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: (_result, _error, id) => [{ type: "Course", id }],
    }),

    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    getAdminAllCourses: builder.query({
      query: () => ({
        url: "get-admin-courses",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["Courses"],
    }),

    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: ["Courses"],
    }),

    addQuestion: builder.mutation({
      query: (data: {
        question: string;
        courseId: string;
        contentId: string;
      }) => ({
        url: "add-question",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Course", id: arg.courseId },
      ],
    }),

    addReview: builder.mutation({
      query: (data: {
        courseId: string;
        review: string;
        rating: number;
      }) => ({
        url: `add-review/${data.courseId}`,
        method: "PUT",
        body: {
          review: data.review,
          rating: data.rating,
        },
        credentials: "include" as const,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Course", id: arg.courseId },
        "Courses",
      ],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useGetSingleCourseQuery,
  useGetCourseContentQuery,
  useAddQuestionMutation,
  useAddReviewMutation,
  useDeleteCourseMutation,
  useGetAdminAllCoursesQuery,
  useEditCourseMutation,
} = courseApi;

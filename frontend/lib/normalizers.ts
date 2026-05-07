/* eslint-disable @typescript-eslint/no-explicit-any */

export const normalizeCoursesResponse = (data: any): any[] => {
  if (!data) return [];

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.courses)) return data.courses;
  if (Array.isArray(data.course)) return data.course;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.data?.courses)) return data.data.courses;
  if (Array.isArray(data.data?.course)) return data.data.course;

  return [];
};

export const normalizeSingleCourseResponse = (data: any): any | null => {
  if (!data) return null;

  if (data.course && !Array.isArray(data.course)) return data.course;
  if (data.data?.course && !Array.isArray(data.data.course)) return data.data.course;
  if (data.data && !Array.isArray(data.data)) return data.data;

  return null;
};

export const normalizeCourseContentResponse = (data: any): any[] => {
  if (!data) return [];

  if (Array.isArray(data.courseData)) return data.courseData;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.course?.courseData)) return data.course.courseData;
  if (Array.isArray(data.data?.courseData)) return data.data.courseData;
  if (Array.isArray(data.data?.course?.courseData)) return data.data.course.courseData;

  return [];
};

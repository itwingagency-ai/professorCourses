/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC } from 'react'
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from '../../../../app/styles/style';
import Ratings from "../../../../app/utils/Ratings";
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
type Props = {
    active: number;
    setActive: (active: number) => void;
    courseData: any;
    handleCourseCreate: any;
    isEdit?: boolean;
}

const TeacherCoursePreview:FC<Props> = ({
    active,
    setActive,
    courseData,
    handleCourseCreate,
    isEdit
}) => {const prevButton = () => {
  setActive(active - 1);
}
const createCourse = () => {
  handleCourseCreate();
};
const discountPercentage = ((courseData?.estimatedPrice - courseData?.price) /
  courseData?.estimatedPrice) * 100;
const discountPercentagePrice = discountPercentage.toFixed(0);
return (
  <div className="w-[90%] ml-20 m-auto py-5 mb-5 " >
    <div className=" w-full relative ">
      <div className="w-full mt-10">
        <CoursePlayer
          videoUrl={courseData?.demoUrl}
          title={courseData?.title || courseData?.name}
          courseId={courseData?._id}
          contentId=""
        />
      </div>

      {/** Price Showing */}
      <div className=" flex items-center ">
        <h1 className="pt-5 text-[25px]  text-black dark:text-white">
          {courseData?.price === 0 ? "Free" : courseData?.price + "$"}
        </h1>
        <h5 className="pl-3 text-[20px] mt-2 line-through opacity-80  text-black dark:text-white" >
          {courseData?.estimatedPrice}$
        </h5>
        <h4 className=" pl-5 pt-4 text-[22px]  text-black dark:text-white">
          {discountPercentagePrice}%Off
        </h4>
      </div>
      {/** Buy Now Button */}
      <div className="flex items-center">
        <div className={`${styles.button} !w-[180px] my-3 font-Poppins !bg-[crimson] cursor-not-allowed `}>
          Buy Now {courseData?.price}$
        </div>
      </div>
      {/** stactic values  */}
      <div className="flex items-center">
        <input type="text"
          name=""
          id=""
          placeholder="Discount Code..."
          className={`${styles.input}  text-black dark:text-white 1500px:!w-[50%] 1100px:!w-[60%] ml-3 !mt-0 border border-black dark:border-white`}
        />
        <div className={`${styles.button} !w-[120px] my-3 ml-4 font-Poppins cursor-pointer `}>
          Apply
        </div>
      </div>
      <p className="pb-1  text-black dark:text-white">. Source Code Included</p>
      <p className="pb-1  text-black dark:text-white">. Full Life Time Access</p>
      <p className="pb-1  text-black dark:text-white">. Certificate of Completion</p>
      <p className="pb-1  text-black dark:text-white">. Premimum Support</p>

      {/* Course Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 p-4 rounded-xl bg-gray-500/10 border border-gray-500/20 text-black dark:text-white font-Poppins">
        <div>
          <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs block uppercase tracking-wider">Language</span>
          <span className="text-sm font-medium">{courseData?.language || "English"}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs block uppercase tracking-wider">Level</span>
          <span className="text-sm font-medium">{courseData?.level || "Beginner"}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs block uppercase tracking-wider">Duration</span>
          <span className="text-sm font-medium">{courseData?.duration || "N/A"}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-500 dark:text-gray-400 text-xs block uppercase tracking-wider">Featured</span>
          <span className="text-sm font-medium">{courseData?.isFeatured ? "Yes" : "No"}</span>
        </div>
      </div>

      {/* Tags */}
      {courseData?.courseTags && courseData.courseTags.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {courseData.courseTags.map((tag: string, index: number) => (
            <span key={index} className="px-3 py-1 bg-[#37a39a]/10 text-[#37a39a] rounded-full text-xs font-semibold">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>

    {/** Ratings */}
    <div className="w-full">
      <div className="w-full 800px:pr-5">
        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
          {courseData?.name}
        </h1>
        <div className="flex items-center justify-between pt-3  text-black dark:text-white">
          <div className="flex items center">
            <Ratings rating={0} />
            <h5>0 Reviews</h5>
          </div>
          <h5> 0 Students </h5>
        </div>
        <br />
        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
          What you will learn from this Course?
        </h1>
      </div>
      {
        (courseData?.whatYouWillLearn || courseData?.benefits)?.map((item: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2  text-black dark:text-white" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">
              {item.title}
            </p>
          </div>
        ))
      }
      <br />

      <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
        What are the Prerequisites for this Course?
      </h1>
      {
        (courseData?.requirements || courseData?.prerequisites)?.map((item: any, index: number) => (
          <div className="w-full flex 800px:items-center py-2  text-black dark:text-white" key={index}>
            <div className="w-[15px] mr-1">
              <IoCheckmarkDoneOutline size={20} />
            </div>
            <p className="pl-2">
              {item.title}
            </p>
          </div>
        ))
      }
      
      {/* Target Audience */}
      {courseData?.targetAudience && courseData.targetAudience.length > 0 && (
        <>
          <br />
          <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
            Who is this course for?
          </h1>
          {courseData.targetAudience.map((item: any, index: number) => (
            <div className="w-full flex 800px:items-center py-2 text-black dark:text-white" key={index}>
              <div className="w-[15px] mr-1">
                <IoCheckmarkDoneOutline size={20} />
              </div>
              <p className="pl-2">{item.title}</p>
            </div>
          ))}
        </>
      )}
      <br />
      {/** Course Decription */}
      <div className="w-full">
        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white">
          Course Details
        </h1>
        <p className="w-full flex items-center justify-between  text-black dark:text-white">
          {courseData?.description}
        </p>
      </div>
      <br />
      <br />
      <div className="w-full flex items-center justify-between">
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer "
          onClick={() => prevButton()}>
          Previous
        </div>
        <div
          className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer "
          onClick={() => createCourse()}>
          {isEdit ? "Update Course" : "Create Course"}
        </div>
      </div>
      <br />
      <br />
    </div>
  </div>
);
}

export default TeacherCoursePreview;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC } from 'react'
import CoursePlayer from "../../../utils/CoursePlayer";
import { styles } from '../../../../app/styles/style';
import Ratings from "../../../../app/utils/Ratings";
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
type Props = {
  active: number;
  setActive: (active: number) => void;
  courseData: any;
  handleCourseCreate: any;
  handleCourseUpdate?: any; // Optional function for updating a course
  isEdit: boolean;
}

const CoursePreview: FC<Props> = ({ active, setActive, courseData, handleCourseCreate, isEdit, handleCourseUpdate }) => {
  const prevButton = () => {
    setActive(active - 1);
  }
  const handleAction = () => {
    
    if (isEdit) {
      //console.log("kkk");
      try{
      handleCourseCreate();
    } catch{
      toast.error("something went wrong here");
    } // Call update function if in edit mode
    } else {
      handleCourseCreate(); // Call create function if in create mode
    }
  
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
            title={courseData?.title}
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
          courseData?.benefits.map((item: any, index: number) => (
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
          courseData?.prerequisites.map((item: any, index: number) => (
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
          {
            isEdit ? (
              <div
            className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer "
            onClick={() => handleAction()}>
            Update Course
          </div>
            ) : (
              <div
            className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer "
            onClick={() => handleAction()}>
              Create Course
          </div>
            )
          }
          
        </div>
        <br />
        <br />
      </div>
    </div>
  );
};

export default CoursePreview;
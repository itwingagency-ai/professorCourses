/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from "react";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CourseData from "./CourseData"
import CourseContent from "./CourseContent";
import CoursePreview from "./CoursePreview";
import toast from "react-hot-toast";
import {  useEditCourseMutation, useGetAdminAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { redirect } from "next/navigation";
import { format } from "timeago.js";

type Props = {
    id: string;
}  
const EditCourse: FC<Props> = ({ id }) => {
    //console.log(id);
    const { isLoading, data, refetch } = useGetAdminAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    // console.log(data);
    const editCourseData = data && data.courses.find((i: any) => i._id === id); // finding the course with the id
    // console.log(editCourseData);
    const [editCourse, {isLoading: iseditLoading, isSuccess, error}] = useEditCourseMutation();
    // useeffect 
    useEffect(() => {
        if (isSuccess) {
            toast.success("Course Updated successfully");
            redirect("/admin/courses");
        }
        else if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [ isSuccess, error]);
    // state Management




    const [active, setActive] = useState(0);
    //use effect for adding editcourse data into courseinfo
    useEffect(() => {
        if (editCourseData) {
            // add data to the field one by one
            console.log(editCourseData);
            setCourseInfo({
                name: editCourseData?.name,
                description: editCourseData?.description,
                price: editCourseData?.price,
                estimatedPrice: editCourseData?.estimatedPrice,
                tags: editCourseData?.tags,
                level: editCourseData?.level,
                category: editCourseData?.category,
                demoUrl: editCourseData?.demoUrl,
                thumbnail: editCourseData?.thumbnail,
            })
            setBenefits(editCourseData?.benefits);
            setPrerequisites(editCourseData?.prerequisites);
            setCourseContentData(editCourseData?.courseData);
        }
    }, [editCourseData]);

    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        category:"",
        demoUrl: "",
        thumbnail: "",
    });
    const [benefits, setBenefits] = useState([{ title: "" }]);
    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
    const [courseContentData, setCourseContentData] = useState([{
        videoUrl: "",
        title: "",
        description: "",
        videoSection: "untitled Section",
        videoLength:"",
        links: [
            {
                title: "",
                url: "",
            },
        ],
        suggestion: "",
    },]);
    const [courseData, setCourseData] = useState({});

    const handleSubmit = async () => {
        // fromate everything in a single object
        const formattedBenefits = benefits.map((benefit) => ({ title: benefit.title }));
        const formattedPrerequisites = prerequisites.map((prerequisite) => ({ title: prerequisite.title }));
        const formattedCourseContentData = courseContentData.map((courseContent) => ({
            videoUrl: courseContent.videoUrl,
            title: courseContent.title,
            description: courseContent.description,
            videoLength: courseContent.videoLength,
            videoSection: courseContent.videoSection,
            links: courseContent.links.map((link) => ({
                title: link.title,
                url: link.url
            })),
            suggestion: courseContent.suggestion,
        }));
        // prepare our data object
        const data = {
            name: courseInfo.name,
            description: courseInfo.description,
            price: courseInfo.price,
            estimatedPrice: courseInfo.estimatedPrice,
            tags: courseInfo.tags,
            level: courseInfo.level,
            category: courseInfo.category,
            demoUrl: courseInfo.demoUrl,
            thumbnail: courseInfo.thumbnail,
            totalVideo: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: formattedCourseContentData,
        };
        // send the data to the server
        setCourseData(data);
    }
    const handleCourseUpdate = async (e: any) => {
        try {
            const data = courseData;
            const editcourseid = editCourseData?._id;
            // console.log(editcourseid);
            // console.log(data);
            if (!iseditLoading) {
                 await editCourse({id:editcourseid, data});  // calling our mutation  
            }
        } catch {
            toast.error("Something went Wrong");
        }
    }

    return (
        <div className="w-full flex min-h-screen">
            {/* Left Section - Course Information */}
            <div className="w-[80%]">
                {active === 0 && (
                    <CourseInformation
                        courseInfo={courseInfo}
                        setCourseInfo={setCourseInfo}
                        active={active}
                        setActive={setActive}
                    />
                )}
                {active === 1 && (
                    <CourseData
                        benefits={benefits}
                        setBenefits={setBenefits}
                        prerequisites={prerequisites}
                        setPrerequisites={setPrerequisites}
                        active={active}
                        setActive={setActive}
                    />
                )
                }
                {active === 2 && (
                    <CourseContent
                        active={active}
                        setActive={setActive}
                        courseContentData={courseContentData}
                        setCourseContentData={setCourseContentData}
                        handleSubmit={handleSubmit}
                    />
                )
                }
                {active === 3 && (
                    <CoursePreview
                        active={active}
                        setActive={setActive}
                        courseData={courseData}
                        handleCourseCreate={handleCourseUpdate}
                        isEdit={true}
                    />
                )
                }
            </div>

            {/* Right Section - Course Options */}
            <div className="w-[20%] h-screen fixed top-0 right-0 z-10 bg-dark mt-[100px]">
                <CourseOptions active={active} setActive={setActive} />
            </div>
        </div>

    );
};
export default EditCourse;

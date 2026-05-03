/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import React, { FC, useEffect, useState } from 'react'
import TeacherCourseInformation from "./TeacherCourseInformation";
import CourseOptions from "./CourseOptions";
import TeacherCourseData from "./TeacherCourseData";
import TeacherCoursePreview from "./TeacherCoursePreview";
import TeacherCourseContent from "./TeacherCourseContent";
import toast from 'react-hot-toast';
import { useCreateCourseMutation } from "@/redux/features/courses/coursesApi";
import { redirect } from "next/navigation";
type Props = {}

const CreateCourse: FC<Props> = () => {
    const [active, setActive] = useState(0);
    const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation();
    // useeffect 
    useEffect(() => {
        if (isSuccess) {
            toast.success("Course created successfully");
            redirect("/admin/all-courses");
        }
        else if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [isLoading, isSuccess, error]);
    // state Management
    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        demoUrl: "",
        thumbnail: "",
    });
    const [benefits, setBenefits] = useState([{ title: "" }]);
    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
    const [courseContentData, setCourseContentData] = useState([{
        videoUrl: "",
        title: "",
        description: "",
        videoSection: "unititled Section",
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
            demoUrl: courseInfo.demoUrl,
            thumbnail: courseInfo.thumbnail,
            totalVideo: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseContentData: formattedCourseContentData,
        };
        // send the data to the server
        setCourseData(data);
    }

    const handleCourseCreate = async (e: any) => {
        try {
            const data = courseData;
            //console.log(data);
            if (!isLoading) {
                await createCourse(data);   
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
                    <TeacherCourseInformation
                        courseInfo={courseInfo}
                        setCourseInfo={setCourseInfo}
                        active={active}
                        setActive={setActive}
                    />
                )}
                {active === 1 && (
                    <TeacherCourseData
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
                    <TeacherCourseContent
                        active={active}
                        setActive={setActive}
                        courseContentData={courseContentData}
                        setCourseContentData={setCourseContentData}
                        handleSubmit={handleSubmit}
                    />
                )
                }
                {active === 3 && (
                    <TeacherCoursePreview
                        active={active}
                        setActive={setActive}
                        courseData={courseData}
                        handleCourseCreate={handleCourseCreate}
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

export default CreateCourse;
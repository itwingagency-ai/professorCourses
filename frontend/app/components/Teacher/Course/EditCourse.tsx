/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import React, { FC, useEffect, useState } from "react";
import TeacherCourseInformation from "./TeacherCourseInformation";
import CourseOptions from "./CourseOptions";
import TeacherCourseData from "./TeacherCourseData"
import TeacherCourseContent from "./TeacherCourseContent";
import TeacherCoursePreview from "./TeacherCoursePreview";
import toast from "react-hot-toast";
import { useEditTeacherCourseMutation, useGetTeacherCoursesQuery } from "@/redux/features/teacher/teacherApi";
import { useRouter } from "next/navigation";

type Props = {
    id: string;
}

const EditCourse: FC<Props> = ({ id }) => {
    const { isLoading, data, refetch } = useGetTeacherCoursesQuery({}, { refetchOnMountOrArgChange: true });
    const editCourseData = data && data.courses.find((i: any) => i._id === id);
    const router = useRouter();
    const [editTeacherCourse, { isLoading: isEditLoading, isSuccess, error }] = useEditTeacherCourseMutation();

    const [active, setActive] = useState(0);

    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        category: "",
        demoUrl: "",
        thumbnail: "",
    });
    const [benefits, setBenefits] = useState([{ title: "" }]);
    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);
    const [courseContentData, setCourseContentData] = useState([{
        videoUrl: "",
        title: "",
        description: "",
        videoSection: "Untitled Section",
        videoLength: "",
        links: [
            {
                title: "",
                url: "",
            },
        ],
        suggestion: "",
    }]);
    const [courseData, setCourseData] = useState({});

    useEffect(() => {
        if (isSuccess) {
            toast.success("Course updated successfully");
            router.push("/teacher/courses");
        } else if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [isSuccess, error, router]);

    useEffect(() => {
        if (editCourseData) {
            setCourseInfo({
                name: editCourseData.name || "",
                description: editCourseData.description || "",
                price: editCourseData.price || "",
                estimatedPrice: editCourseData.estimatedPrice || "",
                tags: editCourseData.tags || "",
                level: editCourseData.level || "",
                category: editCourseData.category || "",
                demoUrl: editCourseData.demoUrl || "",
                thumbnail: editCourseData.thumbnail?.url || editCourseData.thumbnail || "",
            });
            setBenefits(editCourseData.benefits || [{ title: "" }]);
            setPrerequisites(editCourseData.prerequisites || [{ title: "" }]);
            
            if (editCourseData.courseData && editCourseData.courseData.length > 0) {
                setCourseContentData(editCourseData.courseData.map((cd: any) => ({
                    videoUrl: cd.videoUrl || "",
                    title: cd.title || "",
                    description: cd.description || "",
                    videoSection: cd.videoSection || "Untitled Section",
                    videoLength: cd.videoLength || "",
                    links: cd.links && cd.links.length > 0 ? cd.links.map((l: any) => ({
                        title: l.title || "",
                        url: l.url || l.link || "",
                    })) : [{ title: "", url: "" }],
                    suggestion: cd.suggestion || "",
                })));
            }
        }
    }, [editCourseData]);

    const buildCoursePayload = () => {
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

        return {
            name: courseInfo.name,
            description: courseInfo.description,
            category: courseInfo.category || "General",
            price: Number(courseInfo.price) || 0,
            estimatedPrice: courseInfo.estimatedPrice ? Number(courseInfo.estimatedPrice) : undefined,
            tags: courseInfo.tags,
            level: courseInfo.level,
            demoUrl: courseInfo.demoUrl,
            thumbnail: courseInfo.thumbnail,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: formattedCourseContentData,
            status: "published",
        };
    };

    const handleSubmit = async () => {
        const data = buildCoursePayload();
        setCourseData(data);
    };

    const handleCourseUpdate = async (e: any) => {
        try {
            const data = buildCoursePayload();
            if (!isEditLoading) {
                await editTeacherCourse({ id, data }).unwrap();
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="w-full flex min-h-screen">
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
                )}
                {active === 2 && (
                    <TeacherCourseContent
                        active={active}
                        setActive={setActive}
                        courseContentData={courseContentData}
                        setCourseContentData={setCourseContentData}
                        handleSubmit={handleSubmit}
                    />
                )}
                {active === 3 && (
                    <TeacherCoursePreview
                        active={active}
                        setActive={setActive}
                        courseData={courseData}
                        handleCourseCreate={handleCourseUpdate}
                        isEdit={true}
                    />
                )}
            </div>

            <div className="w-[20%] h-screen fixed top-0 right-0 z-10 bg-dark mt-[100px]">
                <CourseOptions active={active} setActive={setActive} />
            </div>
        </div>
    );
};

export default EditCourse;

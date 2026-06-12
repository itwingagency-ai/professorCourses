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
import { useRouter } from "next/navigation";

type Props = {
    id: string;
}  
const EditCourse: FC<Props> = ({ id }) => {
    //console.log(id);
    const { isLoading, data, refetch } = useGetAdminAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    // console.log(data);
    const editCourseData = data && data.courses.find((i: any) => i._id === id); // finding the course with the id
    // console.log(editCourseData);
    const router = useRouter();
    const [editCourse, {isLoading: iseditLoading, isSuccess, error}] = useEditCourseMutation();
    // useeffect 
    useEffect(() => {
        if (isSuccess) {
            toast.success("Course Updated successfully");
            router.push("/admin/courses");
        }
        else if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [ isSuccess, error, router]);
    // state Management




    const [active, setActive] = useState(0);
    //use effect for adding editcourse data into courseinfo
    useEffect(() => {
        if (editCourseData) {
            // add data to the field one by one

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
                language: editCourseData?.language || "English",
                duration: editCourseData?.duration || "",
                previewVideoUrl: editCourseData?.previewVideoUrl || "",
                requirements: editCourseData?.requirements || [{ title: "" }],
                whatYouWillLearn: editCourseData?.whatYouWillLearn || [{ title: "" }],
                targetAudience: editCourseData?.targetAudience || [{ title: "" }],
            })
            setBenefits(editCourseData?.benefits || [{ title: "" }]);
            setPrerequisites(editCourseData?.prerequisites || [{ title: "" }]);
            setCourseContentData(editCourseData?.courseData || []);
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
        language: "English",
        duration: "",
        previewVideoUrl: "",
        requirements: [{ title: "" }],
        whatYouWillLearn: [{ title: "" }],
        targetAudience: [{ title: "" }],
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
        isFreePreview: false,
    },]);
    const [courseData, setCourseData] = useState({});

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
            isFreePreview: (courseContent as any).isFreePreview || false,
        }));
        return {
            name: courseInfo.name,
            description: courseInfo.description,
            price: Number(courseInfo.price) || 0,
            estimatedPrice: courseInfo.estimatedPrice ? Number(courseInfo.estimatedPrice) : undefined,
            tags: courseInfo.tags,
            level: courseInfo.level,
            category: courseInfo.category,
            demoUrl: courseInfo.demoUrl,
            thumbnail: courseInfo.thumbnail,
            totalVideo: courseContentData.length,
            benefits: formattedBenefits,
            prerequisites: formattedPrerequisites,
            courseData: formattedCourseContentData,
            language: courseInfo.language,
            duration: courseInfo.duration,
            previewVideoUrl: courseInfo.previewVideoUrl,
            requirements: courseInfo.requirements,
            whatYouWillLearn: courseInfo.whatYouWillLearn,
            targetAudience: courseInfo.targetAudience,
            courseTags: courseInfo.tags ? courseInfo.tags.split(",").map((t: string) => t.trim()) : [],
        };
    };

    const handleSubmit = async () => {
        // Build the data object and store it for preview display
        const data = buildCoursePayload();
        setCourseData(data);
    }
    const handleCourseUpdate = async (e: any) => {
        try {
            // Build payload fresh from current state to avoid stale closure issue
            const data = buildCoursePayload();
            const editcourseid = editCourseData?._id;
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

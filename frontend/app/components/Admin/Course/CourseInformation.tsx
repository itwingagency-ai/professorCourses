/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { styles } from '@/app/styles/style';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '../../Loader/Loader';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

type Props = {
    courseInfo: any;
    setCourseInfo: (courseInfo: any) => void;
    active: number;
    setActive: (active: number) => void;
}

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {
    const [dragging, setDragging] = useState(false);
    const { data, isLoading } = useGetHeroDataQuery("Categories");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (data) {
            setCategories(data?.layout?.categories);
        }
    }, [data]);

    // Ensure list fields are initialized
    useEffect(() => {
        if (!courseInfo.requirements || courseInfo.requirements.length === 0) {
            setCourseInfo((prev: any) => ({ ...prev, requirements: [{ title: "" }] }));
        }
        if (!courseInfo.whatYouWillLearn || courseInfo.whatYouWillLearn.length === 0) {
            setCourseInfo((prev: any) => ({ ...prev, whatYouWillLearn: [{ title: "" }] }));
        }
        if (!courseInfo.targetAudience || courseInfo.targetAudience.length === 0) {
            setCourseInfo((prev: any) => ({ ...prev, targetAudience: [{ title: "" }] }));
        }
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        // Validation check for dynamic lists
        const isReqValid = courseInfo.requirements?.every((r: any) => r.title.trim() !== "");
        const isLearnValid = courseInfo.whatYouWillLearn?.every((l: any) => l.title.trim() !== "");
        const isAudienceValid = courseInfo.targetAudience?.every((a: any) => a.title.trim() !== "");

        if (!isReqValid || !isLearnValid || !isAudienceValid) {
            toast.error("Please fill in all requirements, outcomes, and target audience fields.");
            return;
        }

        setActive(active + 1);
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    };
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    };
    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCourseInfo({ ...courseInfo, thumbnail: reader.result });
            }
            reader.readAsDataURL(file);
        }
    };

    // Dynamic Lists Handlers
    const handleListChange = (field: string, index: number, value: string) => {
        const list = [...(courseInfo[field] || [])];
        list[index] = { title: value };
        setCourseInfo({ ...courseInfo, [field]: list });
    };

    const handleAddListItem = (field: string) => {
        const list = [...(courseInfo[field] || []), { title: "" }];
        setCourseInfo({ ...courseInfo, [field]: list });
    };

    const handleRemoveListItem = (field: string, index: number) => {
        const list = [...(courseInfo[field] || [])];
        if (list.length > 1) {
            list.splice(index, 1);
            setCourseInfo({ ...courseInfo, [field]: list });
        }
    };

    return (
        <div className="w-[80%] m-auto mt-24">
            <form onSubmit={handleSubmit} className={`${styles.label} space-y-6`}>
                {/* Course Name */}
                <div>
                    <label className={`${styles.label}`}>Course Name</label>
                    <input
                        type="text"
                        required
                        value={courseInfo.name}
                        onChange={(e: any) => setCourseInfo({ ...courseInfo, name: e.target.value })}
                        placeholder="e.g. Machine Learning Full stack Development"
                        className={`${styles.input} border border-black dark:border-white`}
                    />
                </div>

                {/* Course Description */}
                <div>
                    <label className={`${styles.label}`}>Course Description</label>
                    <textarea
                        cols={30}
                        rows={6}
                        placeholder="Write something amazing about this course..."
                        className={`${styles.input} !h-min !py-3 border border-black dark:border-white`}
                        value={courseInfo.description}
                        onChange={(e: any) => setCourseInfo({ ...courseInfo, description: e.target.value })}
                    />
                </div>

                {/* Price & Estimated Price */}
                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>Course Price ($)</label>
                        <input
                            type="number"
                            required
                            value={courseInfo.price}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, price: Number(e.target.value) })}
                            placeholder="29"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>Estimated Price ($) (optional)</label>
                        <input
                            type="number"
                            value={courseInfo.estimatedPrice}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, estimatedPrice: Number(e.target.value) })}
                            placeholder="79"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                </div>

                {/* Tags & Categories */}
                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>Course Tags</label>
                        <input
                            type="text"
                            required
                            value={courseInfo.tags}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, tags: e.target.value })}
                            placeholder="ML, AI, React"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>Course Category</label>
                        <select
                            required
                            value={courseInfo.category}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, category: e.target.value })}
                            className={`${styles.input} dark:bg-gray-800 bg-transparent border border-black dark:border-white`}
                        >
                            <option value="" className="dark:bg-gray-800">Select Category</option>
                            {categories && categories.length > 0 ? (
                                categories.map((item: any) => (
                                    <option key={item._id} value={item.title} className="dark:bg-gray-800">
                                        {item.title}
                                    </option>
                                ))
                            ) : (
                                ["Web Development", "Data Science", "Design", "Mobile Dev", "DevOps", "AI/ML", "Cybersecurity", "Cloud Computing"].map((item, index) => (
                                    <option key={index} value={item} className="dark:bg-gray-800">
                                        {item}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                </div>

                {/* Level & Language */}
                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>Course Level</label>
                        <select
                            required
                            value={courseInfo.level}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, level: e.target.value })}
                            className={`${styles.input} dark:bg-gray-800 bg-transparent border border-black dark:border-white`}
                        >
                            <option value="" className="dark:bg-gray-800">Select Level</option>
                            <option value="Beginner" className="dark:bg-gray-800">Beginner</option>
                            <option value="Intermediate" className="dark:bg-gray-800">Intermediate</option>
                            <option value="Advanced" className="dark:bg-gray-800">Advanced</option>
                        </select>
                    </div>
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>Course Language</label>
                        <select
                            required
                            value={courseInfo.language || "English"}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, language: e.target.value })}
                            className={`${styles.input} dark:bg-gray-800 bg-transparent border border-black dark:border-white`}
                        >
                            <option value="English" className="dark:bg-gray-800">English</option>
                            <option value="Spanish" className="dark:bg-gray-800">Spanish</option>
                            <option value="French" className="dark:bg-gray-800">French</option>
                            <option value="German" className="dark:bg-gray-800">German</option>
                            <option value="Chinese" className="dark:bg-gray-800">Chinese</option>
                            <option value="Japanese" className="dark:bg-gray-800">Japanese</option>
                            <option value="Russian" className="dark:bg-gray-800">Russian</option>
                            <option value="Arabic" className="dark:bg-gray-800">Arabic</option>
                        </select>
                    </div>
                </div>

                {/* Duration & Demo Video URL */}
                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>Course Duration</label>
                        <input
                            type="text"
                            required
                            value={courseInfo.duration}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, duration: e.target.value })}
                            placeholder="e.g. 12 hours / 4 weeks"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                    <div className="w-[45%]">
                        <label className={`${styles.label}`}>Demo / Intro Video URL</label>
                        <input
                            type="text"
                            required
                            value={courseInfo.demoUrl}
                            onChange={(e: any) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })}
                            placeholder="https://youtu.be/..."
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                </div>

                {/* Dynamic List: Requirements */}
                <div>
                    <label className={`${styles.label} text-[18px]`}>Course Requirements</label>
                    {courseInfo.requirements?.map((req: any, index: number) => (
                        <div key={`req-${index}`} className="flex items-center space-x-2 my-2">
                            <input
                                type="text"
                                required
                                value={req.title}
                                onChange={(e) => handleListChange("requirements", index, e.target.value)}
                                placeholder="e.g. Basic JavaScript knowledge"
                                className={`${styles.input} border border-black dark:border-white`}
                            />
                            {courseInfo.requirements.length > 1 && (
                                <RemoveCircleIcon
                                    onClick={() => handleRemoveListItem("requirements", index)}
                                    className="cursor-pointer text-red-500 hover:text-red-600"
                                />
                            )}
                        </div>
                    ))}
                    <AddCircleIcon
                        onClick={() => handleAddListItem("requirements")}
                        className="cursor-pointer dark:text-white text-black mt-1"
                        style={{ fontSize: "28px" }}
                    />
                </div>

                {/* Dynamic List: What You Will Learn */}
                <div>
                    <label className={`${styles.label} text-[18px]`}>What Students Will Learn</label>
                    {courseInfo.whatYouWillLearn?.map((item: any, index: number) => (
                        <div key={`learn-${index}`} className="flex items-center space-x-2 my-2">
                            <input
                                type="text"
                                required
                                value={item.title}
                                onChange={(e) => handleListChange("whatYouWillLearn", index, e.target.value)}
                                placeholder="e.g. Build modern web apps with React"
                                className={`${styles.input} border border-black dark:border-white`}
                            />
                            {courseInfo.whatYouWillLearn.length > 1 && (
                                <RemoveCircleIcon
                                    onClick={() => handleRemoveListItem("whatYouWillLearn", index)}
                                    className="cursor-pointer text-red-500 hover:text-red-600"
                                />
                            )}
                        </div>
                    ))}
                    <AddCircleIcon
                        onClick={() => handleAddListItem("whatYouWillLearn")}
                        className="cursor-pointer dark:text-white text-black mt-1"
                        style={{ fontSize: "28px" }}
                    />
                </div>

                {/* Dynamic List: Target Audience */}
                <div>
                    <label className={`${styles.label} text-[18px]`}>Target Audience</label>
                    {courseInfo.targetAudience?.map((item: any, index: number) => (
                        <div key={`audience-${index}`} className="flex items-center space-x-2 my-2">
                            <input
                                type="text"
                                required
                                value={item.title}
                                onChange={(e) => handleListChange("targetAudience", index, e.target.value)}
                                placeholder="e.g. Beginner developers wanting to level up"
                                className={`${styles.input} border border-black dark:border-white`}
                            />
                            {courseInfo.targetAudience.length > 1 && (
                                <RemoveCircleIcon
                                    onClick={() => handleRemoveListItem("targetAudience", index)}
                                    className="cursor-pointer text-red-500 hover:text-red-600"
                                />
                            )}
                        </div>
                    ))}
                    <AddCircleIcon
                        onClick={() => handleAddListItem("targetAudience")}
                        className="cursor-pointer dark:text-white text-black mt-1"
                        style={{ fontSize: "28px" }}
                    />
                </div>

                {/* Thumbnail Upload */}
                <div>
                    <label className={`${styles.label}`}>Course Thumbnail</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file"
                        className={`w-full min-h-[15vh] dark:border-white border-[#000026] p-3 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            dragging ? "bg-primary/20 border-primary" : "bg-transparent"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {courseInfo.thumbnail ? (
                            <img
                                src={courseInfo.thumbnail.url || courseInfo.thumbnail}
                                alt="thumbnail"
                                className="w-full max-h-[250px] object-contain rounded-md"
                            />
                        ) : (
                            <span className="text-black dark:text-white text-center font-Inter">
                                Drag and drop or click to upload your course thumbnail
                            </span>
                        )}
                    </label>
                </div>

                {/* Submit button */}
                <div className="w-full flex items-center justify-end pt-4">
                    <input
                        type="submit"
                        value="Next"
                        className="w-full sm:w-[180px] flex items-center justify-center h-[42px] bg-[#37a39a] hover:bg-[#2e8c84] text-center text-white rounded font-Poppins font-semibold cursor-pointer shadow-md transition-colors"
                    />
                </div>
            </form>
        </div>
    );
};

export default CourseInformation;
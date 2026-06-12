/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { styles } from '@/app/styles/style';
import { Block } from '@mui/icons-material';
import { div } from 'framer-motion/client';
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsLink45Deg, BsPencil } from 'react-icons/bs';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseContentData: any;
    setCourseContentData: (courseContentData: any) => void;
    handleSubmit: any;
}

const TeacherCourseContent: FC<Props> = ({ active, setActive, courseContentData, setCourseContentData, handleSubmit: handleCourseSubmit }) => {
    // State to track whether each section is collapsed or expanded
    const [isCollapsed, setIsCollapsed] = useState(
        Array(courseContentData.length).fill(false) // Initialize an array of booleans, one for each section
    );

    // State to track the currently active section for new additions
    const [activeSection, setActiveSection] = useState(1);

    // General form submit handler to prevent default behavior
    const handleSubmit = (e: any) => {
        e.preventDefault();
    };

    // Toggles the collapsed state of a specific section
    const handleCollapseToggle = (index: number) => {
        const UpdatedCollapsed = [...isCollapsed];
        UpdatedCollapsed[index] = !UpdatedCollapsed[index];
        setIsCollapsed(UpdatedCollapsed);
    };

    // Removes a specific link from a section
    const handleRemoveLink = (index: number, linkindex: number) => {
        const updatedData = [...courseContentData];
        updatedData[index].links.splice(linkindex, 1); // Remove link at specific index
        setCourseContentData(updatedData);
    };

    // Adds a new empty link field to a section
    const handleAddLink = (index: number) => {
        const updatedData = [...courseContentData];
        updatedData[index].links.push({ title: "", url: "" }); // Push a new empty link object
        setCourseContentData(updatedData);
    };

    // Handles adding new content, ensuring previous fields are filled
    const newContentHandler = (item: any) => {

        // Check if the current fields are filled
        if (item.title === "" || item.description === "" || item.videoUrl === "" || item.links[0].title === "") {
            toast.error("Please fill all the fields"); // Show error toast if any field is empty
        } else {
            let newVideoSection = ""; // Initialize variable for the new video section
            if (courseContentData.length > 0) {
                const lastVideoSection = courseContentData[courseContentData.length - 1].videoSection;

                // Use the last section name if no new name is provided
                if (lastVideoSection) {
                    newVideoSection = lastVideoSection;
                }
            }

            // Add a new content object
            const newContent = {
                videoUrl: "",
                title: "",
                description: "",
                videoSection: newVideoSection,
                links: [{ title: "", url: "" }],
            };
            setCourseContentData([...courseContentData, newContent]); // Update state
        }
    };

    // Adds a new section to the course content
    const addNewSection = () => {
        // Ensure all fields in the last section are filled
        if (
            courseContentData[courseContentData.length - 1].title === "" ||
            courseContentData[courseContentData.length - 1].description === "" ||
            courseContentData[courseContentData.length - 1].videoUrl === "" ||
            courseContentData[courseContentData.length - 1].links[0].title === "" ||
            courseContentData[courseContentData.length - 1].links[0].url === ""
        ) {
            toast.error("Please fill all the fields");
        } else {
            setActiveSection(activeSection + 1); // Increment active section counter
            const newContent = {
                videoUrl: "",
                title: "",
                description: "",
                videoSection: `untitled Section ${activeSection}`, // Default section name
                links: [{ title: "", url: "" }],
            };
            setCourseContentData([...courseContentData, newContent]); // Add new section
        }
    };

    // Handles navigation to the previous step
    const prevButton = () => {
        setActive(active - 1);
    };

    // Handles navigation to the next step
    const handleOptions = () => {
        // Ensure all fields are filled before proceeding
        if (
            courseContentData[courseContentData.length - 1].title === "" ||
            courseContentData[courseContentData.length - 1].description === "" ||
            courseContentData[courseContentData.length - 1].videoUrl === "" ||
            courseContentData[courseContentData.length - 1].links[0].title === "" ||
            courseContentData[courseContentData.length - 1].links[0].url === ""
        ) {
            toast.error("Section Fields can't be empty!");
        } else {
            setActive(active + 1); // Move to the next step
            handleCourseSubmit(); // Submit the data
        }
    };


    return (
        <div className=" w-[80%] m-auto mt-24 p-3 ">
            {/* Form to handle submission */}
            <form onSubmit={handleSubmit}>
                {
                    courseContentData?.map((item: any, index: number) => {
                        // Determine if a new section input should be shown based on the `videoSection` field
                        const showSectionInput =
                            index === 0 || item.videoSection !== courseContentData[index - 1].videoSection;
                        return (
                            <React.Fragment key={index}>
                                {/* Section container with conditional margin styling */}
                                <div className={`w-full bg-[#3b3a3919] dark:bg-[#cdcBc819] p-4 ${showSectionInput ? "mt-8" : "mb-0"}`}>
                                    {
                                        showSectionInput && (
                                            <>
                                                {/* Section title input with pencil icon for editing */}
                                                <div className=" flex w-full items-center">
                                                    <input
                                                        className={`text-[20px] ${item.videoSection === "untitled Section"
                                                            ? "w-[170px]"
                                                            : "w-min"
                                                            } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                                                        value={item.videoSection}
                                                        onChange={(e) => {
                                                            // Update section title in the state
                                                            const updateData = [...courseContentData];
                                                            updateData[index].videoSection = e.target.value;
                                                            setCourseContentData(updateData);
                                                        }}
                                                    />
                                                    {/* Pencil icon for edit */}
                                                    <BsPencil className="cursor-pointer dark:text-white text-black" />
                                                </div>
                                                <br />
                                            </>
                                        )
                                    }
                                    {/* Collapsible video content */}
                                    <div className=" flex w-full items-center justify-between my-0 ">
                                        {isCollapsed[index] ? (
                                            <>
                                                {item.title ? (
                                                    <p className=" font-Poppins dark:text-white  text-black ">
                                                        {/* Display the video title */}
                                                        {index + 1}.{item.title}
                                                    </p>
                                                ) : <></>}
                                            </>
                                        ) : (
                                            <div></div>
                                        )}

                                        {/* Delete and collapse/expand toggle buttons */}
                                        <div className=" flex items-center">
                                            <AiOutlineDelete
                                                className={`dark:text-white text-[20px] mr-2 text-black ${index > 0 ? "cursor-pointer" : "cursor-no-drop"}`}
                                                onClick={() => {
                                                    // Delete content if it's not the first item
                                                    if (index > 0) {
                                                        const updateData = [...courseContentData];
                                                        updateData.splice(index, 1);
                                                        setCourseContentData(updateData);
                                                    }
                                                }}
                                            />
                                            <MdOutlineKeyboardArrowDown
                                                fontSize="large"
                                                className="dark:text-white text-black"
                                                style={{
                                                    transform: isCollapsed[index] ? "rotate(180deg)" : "rotate(0deg)",
                                                }}
                                                onClick={() => handleCollapseToggle(index)}
                                            />
                                        </div>
                                    </div>
                                    {!isCollapsed[index] && (
                                        <>
                                            {/* Video Title input */}
                                            <div className="my-3">
                                                <label className={`${styles.label}`}>
                                                    Video Title
                                                </label>
                                                <input
                                                    type=" text"
                                                    placeholder="Project Plan"
                                                    className={`${styles.input} border border-black dark:border-white`}
                                                    value={item.title}
                                                    onChange={(e) => {
                                                        // Update video title in the state
                                                        const updateData = [...courseContentData];
                                                        updateData[index].title = e.target.value;
                                                        setCourseContentData(updateData);
                                                    }}
                                                />
                                            </div>

                                            {/* Video URL input */}
                                            <div className="my-3">
                                                <label className={`${styles.label}`}>
                                                    Video URL
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="seddrrfc"
                                                    className={`${styles.input} border border-black dark:border-white`}
                                                    value={item.videoUrl}
                                                    onChange={(e) => {
                                                        // Update video URL in the state
                                                        const updateData = [...courseContentData];
                                                        updateData[index].videoUrl = e.target.value;
                                                        setCourseContentData(updateData);
                                                    }}
                                                />
                                            </div>
                                            <div className="my-3">
                                                <label className={`${styles.label}`}>
                                                    Video Length (in minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="20"
                                                    className={`${styles.input} border border-black dark:border-white`}
                                                    value={item.videoLength || ''}
                                                    onChange={(e) => {
                                                        const updateData = [...courseContentData];
                                                        updateData[index].videoLength = e.target.value;
                                                        setCourseContentData(updateData);
                                                    }}
                                                />
                                            </div>
                                            {/* Free Preview Toggle */}
                                            <div className="my-3 flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`free-preview-${index}`}
                                                    checked={item.isFreePreview || false}
                                                    onChange={(e: any) => {
                                                        const updateData = [...courseContentData];
                                                        updateData[index].isFreePreview = e.target.checked;
                                                        setCourseContentData(updateData);
                                                    }}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                                />
                                                <label htmlFor={`free-preview-${index}`} className={`${styles.label} cursor-pointer select-none`}>
                                                    Free Lesson Preview (unlocked for all users)
                                                </label>
                                            </div>

                                            {/* Video description textarea */}
                                            <div className="my-3">
                                                <label className={`${styles.label}`}>
                                                    Video Description
                                                </label>
                                                <textarea
                                                    rows={6}
                                                    cols={30}
                                                    placeholder="This video will help you to do ....."
                                                    className={`${styles.input} border border-black dark:border-white !h-min py-2`}
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        // Update video description in the state
                                                        const updateData = [...courseContentData];
                                                        updateData[index].description = e.target.value;
                                                        setCourseContentData(updateData);
                                                    }}
                                                />
                                                <br />
                                            </div>

                                            {/* Links Section */}
                                            {item?.links.map((link: any, linkindex: number) => (
                                                <div key={linkindex} className="mb-3 block">
                                                    <div className="w-full flex item-center justify-between">
                                                        <label className={`${styles.label}`}>
                                                            Link {linkindex + 1}
                                                        </label>
                                                        <AiOutlineDelete
                                                            className={`${linkindex === 0 ? "cursor-no-drop" : "cursor-pointer"} text-black dark:text-white text-[20px]`}
                                                            onClick={() =>
                                                                linkindex === 0
                                                                    ? null
                                                                    : handleRemoveLink(index, linkindex)
                                                            }
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Source Code ..... (Link title)"
                                                        className={`${styles.input} border border-black dark:border-white `}
                                                        value={link.title}
                                                        onChange={(e) => {
                                                            // Update link title in the state
                                                            const updatedData = [...courseContentData];
                                                            updatedData[index].links[linkindex].title = e.target.value;
                                                            setCourseContentData(updatedData);
                                                        }}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Source Code URL..... (Link URL)"
                                                        className={`${styles.input} border border-black dark:border-white mt-6`}
                                                        value={link.url}
                                                        onChange={(e) => {
                                                            // Update link URL in the state
                                                            const updatedData = [...courseContentData];
                                                            updatedData[index].links[linkindex].url = e.target.value;
                                                            setCourseContentData(updatedData);
                                                        }}
                                                    />
                                                </div>
                                            ))}

                                            {/* Add Link button */}
                                            <br />
                                            <div className="inline-block mb-4">
                                                <p className=" flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                                                    onClick={() => handleAddLink(index)}>
                                                    <BsLink45Deg className="mr-2" /> Add Link
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    <br />
                                    {/* Add New Content button */}
                                    {index === courseContentData.length - 1 && (
                                        <div>
                                            <p className=" flex items-center text-[18px] dark:text-white text-black cursor-pointer"
                                                onClick={(e: any) => newContentHandler(item)}>
                                                <AiOutlinePlusCircle className="mr-2" /> Add New Content
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })
                }
                {/* Add New Section button */}
                <div className="flex items-center text-[20px] mt-5 dark:text-white  text-black cursor-pointer"
                    onClick={() => addNewSection()}>
                    <AiOutlinePlusCircle className=" 5 mr-2" /> Add New Content
                </div>
            </form>

            {/* Navigation buttons */}
            <br />
            <div className="w-full flex items-center justify-between">
                <div
                    className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer "
                    onClick={() => prevButton()}>
                    Previous
                </div>
                <div
                    className="w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer "
                    onClick={() => handleOptions()}>
                    Next
                </div>
            </div>
            <br />
            <br />
        </div>
    );
};

export default TeacherCourseContent;
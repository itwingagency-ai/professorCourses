/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { styles } from '@/app/styles/style';
import React, { FC, useState } from 'react'
import AddCircleIcon from "@mui/icons-material/AddCircle";
import toast from 'react-hot-toast';
type Props = {
    benefits: { title: string }[];
    setBenefits: (benefits: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrerequisites: (prerequisites: { title: string }[]) => void;
    active: number;
    setActive: (active: number) => void;
}

const TeacherCourseData: FC<Props> = ({ benefits, setBenefits, active, setActive, prerequisites, setPrerequisites }) => {


    const handleBenefitsChange = (index: number, value: any) => {
        const updateBenefits = [...benefits];
        updateBenefits[index].title = value
        setBenefits(updateBenefits);
    };

    // handle add benefits
    const handleAddBenefits = () => {
        setBenefits([...benefits, { title: '' }]);
    };
    const handlePrerequisitesChange = (index: number, value: any) => {
        const updatedPrequisites = [...prerequisites];
        updatedPrequisites[index].title = value
        setPrerequisites(updatedPrequisites);
    };

    // handle add PreRequisites
    const handleAddPrerequisites = () => {
        setPrerequisites([...prerequisites, { title: '' }]);
    };

    const prevButton = () => {
        setActive(active - 1);
    };
    const handleOptions = () => {
        if (benefits[benefits.length - 1]?.title !== "" && prerequisites[benefits.length - 1]?.title !== "") {
            setActive(active + 1);
        } else {
            toast.error("please fill the fields for go to the next")
        }
    };

    return (
        <div className=" w-[80%] m-auto mt-24 block ">
            <div>
                <label className={`${styles.label} text-[20px]`} htmlFor="email">
                    What are the benefits for students in this Course?
                </label>
                <br />
                {
                    benefits.map((benefit: any, index: number) => (
                        <input
                            type="text"
                            key={index}
                            name="Benefits"
                            placeholder="you will be able to build ML Application"
                            required
                            className={`${styles.input} my-2 border border-black dark:border-white`}
                            value={benefit.title}
                            onChange={(e) => handleBenefitsChange(index, e.target.value)}
                        />
                    )
                    )
                }
                <AddCircleIcon
                    style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
                    onClick={handleAddBenefits}
                    className="dark:text-white text-black"
                />
            </div>
            <div>
                <label className={`${styles.label} text-[20px]`} htmlFor="email">
                    What are the Prerequisites for students in this Course?
                </label>
                <br />
                {
                    prerequisites.map((prerequisites: any, index: number) => (
                        <input
                            type="text"
                            key={index}
                            name="prerequisites"
                            placeholder="you need basic knowledge of ...."
                            required
                            className={`${styles.input} my-2 border border-black dark:border-white`}
                            value={prerequisites.title}
                            onChange={(e) => handlePrerequisitesChange(index, e.target.value)}
                        />
                    )
                    )
                }
                <AddCircleIcon
                    style={{ margin: "10px 0px", cursor: "pointer", width: "30px" }}
                    onClick={handleAddPrerequisites}
                    className="dark:text-white text-black"
                />
            </div>
            <div className="w-full flex items-center justify-between" >
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
    )
}

export default TeacherCourseData;
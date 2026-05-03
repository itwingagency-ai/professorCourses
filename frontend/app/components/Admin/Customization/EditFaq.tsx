/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { styles } from '@/app/styles/style';
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete } from 'react-icons/ai';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { IoAddCircleOutline } from 'react-icons/io5';
import Loader from '../../Loader/Loader';
import { v4 as uuidv4 } from 'uuid';

type Props = {};

const EditFaq: FC<Props> = ({ }) => {

    const { data, isLoading, refetch } = useGetHeroDataQuery("FAQ", { refetchOnMountOrArgChange: true });
    const [questions, setQuestions] = useState<any[]>([]);
    const [editLayout, { isSuccess: layoutSuccess, error, isLoading: isEditLoading }] = useEditLayoutMutation();

    useEffect(() => {
        if (data) {
            setQuestions(data?.layout?.faq);
        }
        if (layoutSuccess) {
            refetch();
            toast.success("FAQ Updated Successfully");
        } else if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [data, layoutSuccess, error, refetch]);

    const toggleQuestion = (id: any) => {
        setQuestions((prevQuestions) => prevQuestions.map((q) => (q._id === id ? { ...q, active: !q.active } : q)));
    };

    const handleQuestionChange = (id: any, value: string) => {
        setQuestions((prevQuestions) => prevQuestions.map((q) => (q._id === id ? { ...q, question: value } : q)));
    };

    const handleAnswerChange = (id: any, value: string) => {
        setQuestions((prevQuestions) => prevQuestions.map((q) => (q._id === id ? { ...q, answer: value } : q)));
    };

    const newFaqHandler = () => {
        // Check if last question and answer are filled
        if (questions.length > 0 && (questions[questions.length - 1].question === "" || questions[questions.length - 1].answer === "")) {
            toast.error("Please fill the last question and answer");
            return;
        }

        setQuestions((prev) => [
            ...prev,
            {
                _id: uuidv4(), // Assign unique ID
                question: "",
                answer: "",
                active: true, // New FAQs start active
            },
        ]);
    };

    const areQuestionUnchnaged = (originalQuestions: any[], newQuestions: any[]) => {
        return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
    };

    const isAnyQuestionEmpty = (question: any[]) => {
        return question.some((q) => q.question === "" || q.answer === "");
    };

    const handleEdit = async () => {
        if (!areQuestionUnchnaged(questions, data?.layout?.faq) && !isAnyQuestionEmpty(questions)) {
            try {
                if (!isEditLoading) {
                    await editLayout({
                        type: "FAQ",
                        faq: questions,
                    }).unwrap();
                }
            } catch (error) {
                toast.error("Something went wrong while updating the FAQ");
            }
        }
    };

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px] relative">
                    <div className="mt-12">
                        <dl className="space-y-8">
                            {questions.map((q, index) => (
                                <div
                                    key={q._id} // Use unique _id as key
                                    className={` ${index > 0 && "border-t"} border-gray-200 pt-6`}
                                >
                                    <dt className="text-lg">
                                        <button
                                            className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none"
                                            onClick={() => toggleQuestion(q._id)}
                                        >
                                            <input
                                                className={`${styles.input} 
                                                ${q.question ==="" ? "border border-black dark:border-white" : "border-none"} `}
                                                value={q.question}
                                                onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                                                placeholder="Add your Question ..."
                                            />
                                            <span className="ml-6 flex-shrink-0">
                                                {q.active ? (
                                                    <HiMinus className="h-6 w-6" />
                                                ) : (
                                                    <HiPlus className="h-6 w-6" />
                                                )}
                                            </span>
                                        </button>
                                    </dt>
                                    {q.active && (
                                        <dd className="mt-2 pr-12">
                                            <input
                                                className={`${styles.input} 
                                                ${q.answer ==="" ? "border border-black dark:border-white" : "border-none"}`}
                                                value={q.answer}
                                                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                                                placeholder="Add your Answer ..."
                                            />
                                            <span className="ml-6 flex-shrink-0">
                                                <AiOutlineDelete
                                                    className="dark:text-white text-black text-[18px] cursor-pointer"
                                                    onClick={() => {
                                                        setQuestions((prevQuestions) =>
                                                            prevQuestions.filter((item) => item._id !== q._id)
                                                        );
                                                    }}
                                                />
                                            </span>
                                        </dd>
                                    )}
                                </div>
                            ))}
                        </dl>

                        <br />
                        <br />
                        <IoAddCircleOutline
                            className="dark:text-white text-black text-[25px] cursor-pointer"
                            onClick={newFaqHandler}
                        />
                    </div>
                    <button // Changed to button
                        className={`${styles.button}
                        !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34]
                        ${areQuestionUnchnaged(data?.layout.faq, questions) || isAnyQuestionEmpty(questions)
                                ? "!cursor-not-allowed"
                                : "!cursor-pointer !bg-[#42d383]"
                            }
                        !rounded fixed bottom-12 right-12`} // Fixed positioning
                        onClick={
                            areQuestionUnchnaged(data?.layout.faq, questions) || isAnyQuestionEmpty(questions)
                                ? () => null
                                : handleEdit
                        }
                        disabled={areQuestionUnchnaged(data?.layout.faq, questions) || isAnyQuestionEmpty(questions)}
                    >
                        Save
                    </button>
                </div>
            )}
        </>
    );
};

export default EditFaq;
// ``` Key improvements:

// - **`uuid` integration:**  `uuidv4()` is used to assign unique `_id`s to new FAQs.
// - **`key` prop fix:**  `q._id` is used as the key in the `map` function, resolving the input mirroring problem.
// - **`newFaqHandler` enhancements:** Prevents adding new FAQs if the last one is not filled and initializes `active` to `true`.
// - **`areQuestionUnchnaged` and `handleEdit` improvements:**  Removed unnecessary parameters and used `.unwrap()` for easier error handling with the RTK Query mutation.
// - **Save button positioning:** Fixed to bottom-right, with relative positioning on the parent.
// - **Comments and existing logic retained:**  Your comments and logic are preserved, just enhanced for correctness and best practices.


// This version addresses the input mirroring issue, provides unique IDs for FAQs, improves the error handling, and keeps your existing logic and comments intact. Install `uuid` if you haven't:  `npm install uuid`.

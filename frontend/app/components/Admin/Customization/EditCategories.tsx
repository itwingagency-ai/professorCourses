/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { styles } from '@/app/styles/style';
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react';
import Loader from '../../Loader/Loader';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

type Props = {};

const EditCategories: FC<Props> = () => {
    const { data, isLoading, refetch } = useGetHeroDataQuery("Categories", { refetchOnMountOrArgChange: true });
    const [editLayout, { isSuccess: layoutSuccess, error, isLoading: isEditLoading }] = useEditLayoutMutation();
    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
        if (data) {
            setCategories(data?.layout?.categories);
        }
        if (layoutSuccess) {
            refetch();
            toast.success("Categories Updated Successfully");

        } else if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }

    }, [data, layoutSuccess, error, refetch]);

    const handleCategoriesAdd = (id: any, value: string) => {
        // add categories
        setCategories((prevCategory: any) =>
            prevCategory.map((i: any) => (i._id === id ? { ...i, title: value } : i))
        );
    };

    const newCategoriesHandler = () => {
        // logic check if last categories contained title value or not
        if (categories.length > 0 && categories[categories.length - 1].title === "") {
            toast.error("Category title cannot be empty");
            return;
        }

        setCategories((prevCategory: any) => [
            ...prevCategory,
            {
                _id: uuidv4(), // Assign unique ID
                title: "",
            },
        ]);
    };

    const areCategoriesUnchnaged = (
        originalCategories: any[],
        newCategories: any[],
    ) => {
        return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
    };

    const isAnyCategoriesTitleEmpty = (categories: any[]) => {
        return categories.some((c) => c.title === "");
    };

    const editCategoriesHandler = async () => {
        if (!areCategoriesUnchnaged(data?.layout.categories, categories) && !isAnyCategoriesTitleEmpty(categories)) {
            try {
                if (!isEditLoading) {
                    await editLayout({
                        type: "Categories",
                        categories: categories,
                    });
                }
            } catch {
                toast.error("Something went wrong while updating the categories");
            }
        }
    };



    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="mt-[120px] text-center relative"> {/* Added relative here */}
                    <h1 className={`${styles.title}`}>All Categories</h1>
                    {/* loop categories */}
                    {categories && categories.map((item: any, index: number) => (
                        <div key={item._id} className="p-3"> {/* Use item._id as key */}
                            <div className="flex items-center w-full justify-center">
                                <input
                                    className={`${styles.input} !w-[unset]  !text-[20px]
                                    ${item.title ==="" ? "border border-black dark:border-white" : "border-none"}`}
                                    value={item.title}
                                    onChange={(e) => handleCategoriesAdd(item._id, e.target.value)}
                                    placeholder="Enter Category title..."
                                />
                                <AiOutlineDelete
                                    className="dark:text-white text-black text-[18px] cursor-pointer"
                                    onClick={() => {
                                        setCategories((prevCategory: any) =>
                                            prevCategory.filter((i: any) => i._id !== item._id)
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                    <br />
                    <br />
                    <div className="w-full flex justify-center">
                        <IoMdAddCircleOutline
                            className="dark:text-white text-black text-[25px] cursor-pointer"
                            onClick={newCategoriesHandler}
                        />
                    </div>

                    {/* Save Button with improved positioning */}
                    <button // Changed to button element
                        className={`${styles.button}
                            !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34]
                            ${areCategoriesUnchnaged(data?.layout.categories, categories) ||
                            isAnyCategoriesTitleEmpty(categories)
                            ? "!cursor-not-allowed"
                            : "!cursor-pointer !bg-[#42d383]"
                            }
                            !rounded fixed bottom-12 right-12`} // Fixed positioning
                        onClick={
                            areCategoriesUnchnaged(data?.layout.categories, categories) ||
                                isAnyCategoriesTitleEmpty(categories)
                                ? () => null
                                : editCategoriesHandler
                        }
                        disabled={areCategoriesUnchnaged(data?.layout.categories, categories) || isAnyCategoriesTitleEmpty(categories)}
                    >

                        Save
                    </button>

                </div>
            )}
        </>
    );
};

export default EditCategories;


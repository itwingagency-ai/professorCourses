/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { styles } from '@/app/styles/style';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Loader from '../../Loader/Loader';

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
    // useeffect for setting the categories
    useEffect(() => {
        if (data) {
            // console.log(data);
            setCategories(data?.layout?.categories);
        }
    }, [data])

    const handleSubmit = (e: any) => {
        if (e) {
            e.preventDefault();
            setActive(active + 1);
        } else {
            toast.error("please fill the fields for go to the next")
        }
    }

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
    {/** drag and drop handles function */ }
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
    }

    return (
        <div className="w-[80%] m-auto mt-24 " >
            <form onSubmit={handleSubmit} className={`${styles.label}`}>
                <div>
                    <label htmlFor="">
                        Course Name
                    </label>
                    <input
                        type="name"
                        name=""
                        required /** formik validation pending  */
                        value={courseInfo.name}
                        onChange={(e: any) =>
                            setCourseInfo({ ...courseInfo, name: e.target.value })
                        }
                        id="name"
                        placeholder="Machine Learning Full stack Development"
                        className={`${styles.input} border border-black dark:border-white`}
                    />
                </div>
                <br />
                <div className="mb-5">
                    <label className={`${styles.label}`}>
                        Course Description
                    </label>
                    <textarea name="" id="" cols={30} rows={8}
                        placeholder=" Write Something Amazing..."
                        className={`${styles.input} !h-min !py-3 border border-black dark:border-white`}
                        value={courseInfo.description}
                        onChange={(e: any) =>
                            setCourseInfo({ ...courseInfo, description: e.target.value })
                        }
                    >

                    </textarea>
                </div>
                <br />
                <div className="w-full flex justify-between">
                    <div className=" w-[45%]" >
                        <label className={`${styles.label}`}>
                            Course Price
                        </label>
                        <input
                            type="number"
                            name=""
                            required /** formik validation pending  */
                            value={courseInfo.price}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, price: e.target.value })
                            }
                            id="price"
                            placeholder="29"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                    <div className=" w-[45%]" >
                        <label className={`${styles.label}`}>
                            Estimated Price (optional)
                        </label>
                        <input
                            type="number"
                            name=""
                            /** formik validation pending  */
                            value={courseInfo.estimatedPrice}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })
                            }
                            id="price"
                            placeholder="79"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                </div>
                <br />
                <div className="w-full flex justify-between">
                    <div className=" w-[45%]" >
                        <label className={`${styles.label}`} htmlFor="email">
                            Course Tags
                        </label>
                        <input
                            type="text"
                            name=""
                            required /** formik validation pending  */
                            value={courseInfo.tags}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, tags: e.target.value })
                            }
                            id="tags"
                            placeholder="ML, AI, Api etc"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                    <div className="w-[45%]">
                        <label className={`${styles.label} w-[50%]`} >
                            Course Category
                        </label>
                        <select name="" id="" className={`${styles.input} className="dark:text-white text-black"`}
                            value={courseInfo.category}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, category: e.target.value })
                            }
                        >
                            <option value="Select Category" className="dark:text-black text-black">Select Category</option>
                            {
                                categories?.map((item: any) => (
                                    <option key={item._id} value={item.title} className="dark:text-black text-black">
                                        {item.title}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
                <br />
                <div className="w-full flex justify-between">
                    <div className=" w-[45%]" >
                        <label className={`${styles.label}`}>
                            Course Level
                        </label>
                        <input
                            type="text"
                            name=""
                            required /** formik validation pending  */
                            value={courseInfo.level}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, level: e.target.value })
                            }
                            id="level"
                            placeholder="Intermediate/Beginner/Expert"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                    <div className="w-[45%]">
                        <label className={`${styles.label} w-[50%]`} >
                            Demo Url
                        </label>
                        <input
                            type="text"
                            name=""
                            required /** formik validation pending  */
                            value={courseInfo.demoUrl}
                            onChange={(e: any) =>
                                setCourseInfo({ ...courseInfo, demoUrl: e.target.value })
                            }
                            id="demoUrl"
                            placeholder="eer74fd"
                            className={`${styles.input} border border-black dark:border-white`}
                        />
                    </div>
                </div>
                <br />
                <div className="w-full">
                    <input
                        type="file"
                        accept="image/*"
                        id="file"
                        className="hidden border border-black dark:border-white"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file"
                        className={`w-full min-h-[10vh] dark:border-white  border-[#000026] p-3 border flex items-center justify-center ${dragging ? "bg-blue-500" : "bg-transparent"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {
                            courseInfo.thumbnail ? (
                                // eslint-disable-next-line @next/next/no-img-element

                                courseInfo.thumbnail.url ? (
                                    <img src={courseInfo.thumbnail.url} alt="thumbnail" className="w-full max-h-full object-cover" />
                                ) : (
                                    <img src={courseInfo.thumbnail} alt="thumbnail" className="w-full max-h-full object-cover" />
                                )

                            ) : (
                                <span className="text-black dark:text-white">
                                    Drag and drop or click to upload your Thumbanil
                                </span>
                            )
                        }
                    </label>
                </div>
                <br />
                <br />
                <div className="w-full flex items-center justify-end">
                    <input
                        type="submit"
                        value="Next"
                        className=" w-full 800px:w-[180px] flex items-center justify-center h-[40px] bg-[#37a39a] text-center text-[#fff] rounded mt-8 cursor-pointer"
                    />
                </div>
                <br />
                <br />
            </form>
        </div>
    );
};


export default CourseInformation;
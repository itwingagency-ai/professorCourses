/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { styles } from '@/app/styles/style';
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import Image from 'next/image';
import { isAbsolute } from 'path';
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineCamera } from 'react-icons/ai';

type Props = {}

const EditHero: FC<Props> = ({ }) => {
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const { data, refetch } = useGetHeroDataQuery("Banner", { refetchOnMountOrArgChange: true });
    const [editLayout, { isSuccess, error, isLoading }] = useEditLayoutMutation();
    useEffect(() => {
        if (data) {
            setTitle(data?.layout?.banner.title);
            setSubTitle(data?.layout?.banner.subTitle);
            setImage(data?.layout?.banner?.image?.url);
        }
        if (isSuccess) {
            refetch();
            toast.success("Hero Updated Successfully");
        }
        else if (error) {
            if ("data" in error) {
                const errorMessage = error as any;
                toast.error(errorMessage.data.message);
            }
        }
    }, [data, isSuccess, error, refetch])

    const handleUpdate = (e: any) => {
        // handle Image update
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (reader.readyState === 2) {
                    setImage(e.target.result as string);
                }
            }
            reader.readAsDataURL(file);
        }
    }
    const handleEdit = async () => {
        // updating the hero
        try {
            if (!isLoading) {
                await editLayout({
                    type: "Banner",
                    image,
                    title,
                    subTitle,
                })
            }
        } catch {
            toast.error("Something went wrong while updating the hero");
        }
    };
    return (
        <>
            <div className="w-full 1000px:flex items-center">
                <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[40vh] left-5 w-[40vh] hero_animation rounded-[50%] 1100px:left-[18rem] 1500px:left-[21rem]  "></div>
                {/* Left Column - Image */}
                <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10  ">
                    <div className=" relative flex items-center justify-end">
                        <img
                            src={image} // replace with actual image path
                            alt=""
                            className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
                        />
                        <input
                            type="file"
                            name=""
                            id="banner"
                            accept="image/*"
                            onChange={handleUpdate}
                            className="hidden"
                        />
                        <label htmlFor="banner" className="absolute bottom-0 right-0 z-20">
                            <AiOutlineCamera className=" dark:text-white text-black text-[18px] cursor-pointer" />
                        </label>
                    </div>
                </div>
                {/* Right Column - Content */}
                <div className="1000px:w-[60%]  flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px] ml-[140px]">
                    <textarea className="dark:text-white text-[#000000c7] resize-none text-[30px] px-3 w-full 1000px:text-[60px] 1500px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[60%] 1100px:w-[78%] bg-transparent"
                        placeholder="Improve your Online Learning Experience"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        rows={4}
                    />
                    <br />
                    <textarea className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%] bg-transparent"
                        placeholder=" Personalized guidance, step-by-step explanations, and a supportive community to accelerate your learning."
                        value={subTitle}
                        onChange={(e) => setSubTitle(e.target.value)}
                        rows={3}
                    />
                    <br />
                    <br />
                    <br />
                    < div
                        className={`${styles.button} 
                    !w-[100px] !min-h-[40px]  dark:text-white text-black bg-[#cccccc34]
                    ${data?.layout?.banner?.title !== title ||
                                data?.layout?.banner?.subTitle !== subTitle ||
                                data?.layout?.banner?.image?.url !== image
                                ? "!cursor-pointer !bg-[#42d383]"
                                : "!cursor-not-allowed"
                            }
                    !rounded absolute bottom-12 right-12`}
                        onClick={
                            data?.layout?.banner?.title !== title ||
                                data?.layout?.banner?.subTitle !== subTitle ||
                                data?.layout?.banner?.image?.url !== image
                                ? handleEdit
                                : () => null
                        }
                    >
                        Save
                    </div>
                </div >
            </div>
        </>
    )
}

export default EditHero
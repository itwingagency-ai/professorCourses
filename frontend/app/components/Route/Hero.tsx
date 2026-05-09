/* eslint-disable @typescript-eslint/no-require-imports */
import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BiSearch } from 'react-icons/bi';

type Props = {}

const Hero: FC<Props> = (props) => {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-[15%] left-[10%] w-[30vw] h-[30vw] bg-primary/20 dark:bg-primary/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob"></div>
            <div className="absolute top-[20%] right-[10%] w-[25vw] h-[25vw] bg-purple-400/20 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[10%] left-[30%] w-[35vw] h-[35vw] bg-blue-400/20 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>

            <div className="w-[90%] max-w-[1400px] mx-auto flex flex-col-reverse 1000px:flex-row items-center justify-between z-10 pt-[80px] 1000px:pt-0 gap-12">
                
                {/* Left Content Column */}
                <div className="w-full 1000px:w-[55%] flex flex-col items-center 1000px:items-start text-center 1000px:text-left space-y-8 animate-fade-in">
                    <div className="inline-block px-4 py-2 rounded-full glass border border-primary/30 shadow-sm shadow-primary/10 mb-2">
                        <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-Inter font-semibold text-sm tracking-wider uppercase">
                            Premium Learning Experience
                        </span>
                    </div>
                    
                    <h1 className="text-[40px] 800px:text-[55px] 1100px:text-[75px] font-Outfit font-[700] text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                        Conquer Your <br className="hidden 1000px:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                            Coding Challenges
                        </span>
                    </h1>
                    
                    <p className="text-gray-600 dark:text-gray-300 font-Inter text-[18px] 1100px:text-[20px] leading-relaxed max-w-[600px] font-light">
                        Personalized guidance, step-by-step explanations, and a supportive community to accelerate your tech career.
                    </p>
                    
                    {/* Modern Search Bar */}
                    <div className="w-full max-w-[550px] relative mt-4 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-[16px] blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                        <div className="relative glass rounded-[14px] flex items-center p-2 shadow-lg">
                            <input 
                                placeholder="Search premium courses..." 
                                className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-400 px-4 py-3 font-Inter text-[16px]"
                                type="search" 
                                spellCheck="false" 
                            />
                            <button className="bg-primary hover:bg-primaryDark text-white w-[50px] h-[50px] rounded-[10px] flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-md">
                                <BiSearch className="text-[24px]" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Social Proof */}
                    <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-white/10 w-full max-w-[550px]">
                        <div className="flex -space-x-3">
                            <Image src={require("../../../public/assests/client-1.jpg")} alt="Student" className="w-10 h-10 rounded-full border-2 border-white dark:border-darkBg object-cover" />
                            <Image src={require("../../../public/assests/client-2.jpg")} alt="Student" className="w-10 h-10 rounded-full border-2 border-white dark:border-darkBg object-cover" />
                            <Image src={require("../../../public/assests/client-3.jpg")} alt="Student" className="w-10 h-10 rounded-full border-2 border-white dark:border-darkBg object-cover" />
                        </div>
                        <p className="font-Inter text-gray-600 dark:text-gray-300 text-[15px]">
                            <span className="font-semibold text-gray-900 dark:text-white">500K+</span> students already joined.{" "}
                            <Link className="text-primary hover:text-primaryDark dark:hover:text-primaryLight font-semibold underline underline-offset-4 decoration-primary/30 transition-colors" href="/courses">
                                Explore Courses
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Image Column */}
                <div className="w-full 1000px:w-[45%] flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full filter blur-[80px] animate-pulse"></div>
                    <div className="relative z-10 animate-float">
                        <Image
                            src={require("../../../public/assests/banner-img-1.png")}
                            alt="Hero Banner"
                            className="object-contain w-full max-w-[500px] 1500px:max-w-[600px] drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Hero;
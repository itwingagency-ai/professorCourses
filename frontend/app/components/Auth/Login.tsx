/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { FC, useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { motion } from "framer-motion";
import { styles } from '../../../app/styles/style';
import Image from 'next/image';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
};

const Schema = Yup.object().shape({
    email: Yup.string().email("Invalid email!").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(6),
});

const Login: FC<Props> = ({ setRoute, setOpen }) => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [login, { isSuccess, isError, error, data, isLoading }] = useLoginMutation();
    // adjusting padding right prblem on each time model is open
    useEffect(() => {
        const openModal = () => {
            if (!document.body.style.paddingRight) {
                document.body.style.paddingRight = "23px";
            }
            document.body.style.overflow = "hidden";
        };

        const closeModal = () => {
            document.body.style.paddingRight = "";
            document.body.style.overflow = "";
        };

        openModal();

        return () => {
            closeModal();
        };
    }, []);

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: Schema,
        onSubmit: async ({ email, password, }) => {
            await login({ email, password })
        },
    });
    useEffect(() => {
        if (isSuccess && data?.user) {
            toast.success("Login Successfully!");
            setOpen(false);

            const role = data.user.role === "user" ? "student" : data.user.role;

            if (role === "student") {
                router.push("/student/dashboard");
            } else if (role === "teacher") {
                router.push("/teacher");
            } else if (role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
        }

        if (isError && error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data?.message || "Login failed");
            } else {
                if (process.env.NODE_ENV === "development") console.log("An error occurred:", error);
                toast.error("Login failed");
            }
        }
    }, [isSuccess, isError, error, data, router, setOpen]);

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
            >
                {/* Animated bouncing logo */}
                <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-600 flex items-center justify-center"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: 1,
                        transition: {
                            y: {
                                repeat: Infinity,
                                duration: 2,
                                ease: "easeInOut"
                            },
                            opacity: { duration: 0.5 }
                        }
                    }}
                >
                    {/* Option 1: Using Next.js Image component */}
                    <Image
                        src={require("../../../public/assests/client-3.jpg")} // Add your logo path here
                        alt="3S Logo"
                        width={80}
                        height={80}
                        className="rounded-full"
                    />
                </motion.div>

                <h2 className={`${styles.title}`}>
                    Login to 3S Consultant
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className={`${styles.label}`}>
                            Email Address
                        </label>
                        <div className="relative flex items-center">
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={values.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-3 py-2 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 text-black dark:text-white`}
                                placeholder="Enter your email"
                                style={{ minHeight: '40px' }}
                            />
                            <div className="absolute left-0 pl-3 pointer-events-none">
                                <MdEmail className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        {errors.email && touched.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className={`${styles.label}`}>
                            Password
                        </label>
                        <div className="relative">
                            {/* Password icon container */}
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {/* You can import and use a password icon here, for example: */}
                                <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
                            </div>

                            {/* Password input */}
                            <input
                                id="password"
                                type={show ? "text" : "password"}
                                name="password"
                                value={values.password}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-10 py-2 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 text-black dark:text-white`}
                                placeholder="Enter your password"
                            />

                            {/* Show/Hide password icon */}
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="focus:outline-none"
                                >
                                    {show ? (
                                        <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <AiOutlineEye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {errors.password && touched.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {/* <button
                        type="submit"
                        className={`${styles.button} shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                        Login
                    </button> */}
                    <div className="flex justify-center">
                        <button
                            className={`${styles.button} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                    Verifying...
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800  text-black dark:text-white">OR</span>
                        </div>
                    </div>

                    {/* <div className="mt-6 flex justify-center space-x-6">
                        
                        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                            
                            <FcGoogle size={20} onClick={() => signIn("google")} />
                        </button>
                        <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                            <AiFillGithub size={20} className="text-gray-800 dark:text-white" onClick={() => signIn("github")} />
                        </button>
                    </div> */}
                    <h5 className=" text-center pt-4 font-Poppins text-[14px] text-black dark:text-white ">
                        Not have any Accounts? {" "}
                        <span className="text-[#2190ff] pl-1 cursor-pointer "
                            onClick={() => setRoute("Sign-Up")}>
                            Sign up
                        </span>
                    </h5>
                </div>
                {/* Optional: Add loading overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg" style={{ minWidth: '250px' }}> {/* Added minWidth */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
                <p className="text-black dark:text-white whitespace-nowrap"> Verifying...</p> {/* Added whitespace-nowrap */}
              </div>
            </div>
          </div>
        )}
            </motion.div>
        </div>
    );
};

export default Login;
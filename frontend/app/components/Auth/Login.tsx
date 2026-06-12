/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { FC, useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { HiExclamationCircle } from 'react-icons/hi';
import { motion } from "framer-motion";
import Link from 'next/link';
import { styles } from '../../../app/styles/style';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
};

const Schema = Yup.object().shape({
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    password: Yup.string().required("Password is required").min(6, "Must be at least 6 characters"),
});

const Login: FC<Props> = ({ setRoute, setOpen }) => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [login, { isSuccess, isError, error, data, isLoading }] = useLoginMutation();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: Schema,
        onSubmit: async ({ email, password }) => {
            await login({ email, password });
        },
    });

    useEffect(() => {
        if (isSuccess && data?.user) {
            toast.success("Welcome back! 🎉");
            setOpen(false);
            const role = data.user.role === "user" ? "student" : data.user.role;
            if (role === "student") router.push("/student/dashboard");
            else if (role === "teacher") router.push("/teacher");
            else if (role === "admin") router.push("/admin");
            else router.push("/");
        }
        if (isError && error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.data?.message || "Login failed");
            } else {
                toast.error("Login failed. Please try again.");
            }
        }
    }, [isSuccess, isError, error, data, router, setOpen]);

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full"
        >
            {/* Brand Header */}
            <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primaryDark flex items-center justify-center shadow-lg shadow-primary/30">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-Poppins">
                    Welcome back
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-Inter">
                    Sign in to continue to 3S Consultant
                </p>
            </div>

            {/* Error Banner */}
            {isError && error && "data" in error && (
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 mb-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-lg font-Inter"
                >
                    <HiExclamationCircle className="text-lg flex-shrink-0" />
                    <span>{(error as any).data?.message || "Invalid email or password"}</span>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label htmlFor="login-email" className={styles.label}>Email Address</label>
                    <div className="relative">
                        <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            className={`${styles.input} pl-10 ${errors.email && touched.email ? 'border-red-400 dark:border-red-500 focus:ring-red-300/40 focus:border-red-400' : ''}`}
                            placeholder="your@email.com"
                        />
                    </div>
                    {errors.email && touched.email && (
                        <p className={styles.errorText}>
                            <HiExclamationCircle className="text-sm" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="login-password" className={styles.label} style={{ marginBottom: 0 }}>Password</label>
                        <Link
                            href="/forgot-password"
                            onClick={() => setOpen(false)}
                            className="text-xs text-primary hover:text-primaryDark font-medium transition-colors font-Inter"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            id="login-password"
                            type={show ? "text" : "password"}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            className={`${styles.input} pl-10 pr-10 ${errors.password && touched.password ? 'border-red-400 dark:border-red-500 focus:ring-red-300/40 focus:border-red-400' : ''}`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShow(!show)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            aria-label={show ? "Hide password" : "Show password"}
                        >
                            {show ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                        </button>
                    </div>
                    {errors.password && touched.password && (
                        <p className={styles.errorText}>
                            <HiExclamationCircle className="text-sm" />
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`${styles.button} mt-2 ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? (
                        <>
                            <div className={styles.loadingSpinner} />
                            Signing in...
                        </>
                    ) : 'Sign In'}
                </button>
            </form>

            {/* Divider */}
            <div className="relative mt-5 mb-4">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white dark:bg-gray-800 text-gray-400 font-Inter">
                        Don&apos;t have an account?
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setRoute("Sign-Up")}
                className="w-full py-2.5 text-sm font-semibold text-primary hover:text-primaryDark border border-primary/30 hover:border-primary rounded-lg transition-all duration-200 font-Inter"
            >
                Create a free account
            </button>
        </motion.div>
    );
};

export default Login;
"use client";
import React, { useState, useEffect } from "react";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import toast from "react-hot-toast";
import { AiOutlineMail, AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(-1);
  const [route, setRoute] = useState("Login");

  const [forgotPassword, { isSuccess, error, isLoading, data }] = useForgotPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Reset link sent to your email!");
      setEmail("");
    }
    if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message || "Failed to send reset link");
    }
  }, [isSuccess, error, data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    await forgotPassword({ email });
  };

  return (
    <div className="min-h-screen bg-lightBg dark:bg-darkBg flex flex-col justify-between">
      <Heading
        title="Forgot Password - THE3S"
        description="Reset your password to regain access to your account."
        keywords="LMS, Reset Password, Forgot Password"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 glass p-8 sm:p-10 rounded-2xl shadow-xl relative overflow-hidden">
          {/* Subtle design element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl"></div>

          <div className="relative z-10">
            <h2 className="text-center text-3xl font-Outfit font-bold text-gray-900 dark:text-white">
              Forgot Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 font-Inter">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-Poppins mb-2">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white bg-transparent focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-Inter transition duration-300"
                  placeholder="name@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {isSuccess && data?.resetUrl && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-600 dark:text-yellow-400 font-Inter">
                <p className="font-semibold mb-1">Development Mode Link:</p>
                <a 
                  href={data.resetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="underline break-all hover:text-yellow-500"
                >
                  {data.resetUrl}
                </a>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-md shadow-primary/20 ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </div>

            <div className="flex items-center justify-center mt-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-Poppins"
              >
                <AiOutlineArrowLeft />
                <span>Back to Home</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

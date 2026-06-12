"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "../../redux/features/auth/authApi";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import toast from "react-hot-toast";
import { AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineArrowLeft } from "react-icons/ai";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams ? searchParams.get("token") : null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(-1);
  const [route, setRoute] = useState("Login");

  const [resetPassword, { isSuccess, error, isLoading, data }] = useResetPasswordMutation();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid password reset token.");
    }
  }, [token]);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Password reset successfully!");
      // Redirect to home and trigger login modal if needed
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
    if (error) {
      const errorData = error as any;
      toast.error(errorData?.data?.message || "Failed to reset password");
    }
  }, [isSuccess, error, data, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("No password reset token was found in the URL.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    await resetPassword({ token, password });
  };

  return (
    <div className="min-h-screen bg-lightBg dark:bg-darkBg flex flex-col justify-between">
      <Heading
        title="Reset Password - THE3S"
        description="Reset your password to regain access to your account."
        keywords="LMS, Reset Password, Auth"
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
          {/* Design elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full filter blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl"></div>

          <div className="relative z-10">
            <h2 className="text-center text-3xl font-Outfit font-bold text-gray-900 dark:text-white">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 font-Inter">
              Enter and confirm your new password below.
            </p>
          </div>

          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-Poppins mb-2">
                  New Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-white/10 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white bg-transparent focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-Inter transition duration-300"
                    placeholder="Min 6 characters"
                    disabled={isLoading || !token}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-Poppins mb-2">
                  Confirm New Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AiOutlineLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-white/10 rounded-lg placeholder-gray-400 text-gray-900 dark:text-white bg-transparent focus:outline-none focus:ring-primary focus:border-primary sm:text-sm font-Inter transition duration-300"
                    placeholder="Repeat password"
                    disabled={isLoading || !token}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !token}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-md shadow-primary/20 ${
                  isLoading || !token ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Reset Password"
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

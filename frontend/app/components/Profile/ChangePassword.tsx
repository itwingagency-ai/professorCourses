"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";

const ChangePassword: FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordUpdate = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("New password must be different from old password.");
      return;
    }

    try {
      const response: any = await updatePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success(response?.message || "Password updated successfully.");
      resetForm();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          "Failed to update password."
      );
    }
  };

  return (
    <div className="w-full px-4 800px:px-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white">
          Change Password
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Update your account password securely.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-5 800px:p-8">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-[15px] font-semibold text-black dark:text-white mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              className="w-full px-5 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a]"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-[15px] font-semibold text-black dark:text-white mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full px-5 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a]"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-[15px] font-semibold text-black dark:text-white mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full px-5 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a]"
              placeholder="Confirm new password"
            />
          </div>

          <button
            onClick={handlePasswordUpdate}
            disabled={isLoading}
            className={`w-full 800px:w-fit px-8 py-3 rounded-lg text-white font-semibold transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#37a39a] hover:opacity-90"
            }`}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import avatarIcon from "../../../public/assests/avatar.png";
import {
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
} from "@/redux/features/user/userApi";

type Props = {
  user: any;
  avatar?: any;
};

const ProfileInfo: FC<Props> = ({ user }) => {
  const [name, setName] = useState(user?.name || "");
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();

  const [updateAvatar, { isLoading: isUpdatingAvatar }] =
    useUpdateAvatarMutation();

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  const userAvatar = previewAvatar || user?.avatar?.url || avatarIcon;

  const handleProfileUpdate = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Please enter your name.");
      return;
    }

    if (trimmedName.length < 2) {
      toast.error("Name is too short.");
      return;
    }

    if (trimmedName === user?.name) {
      toast("No profile changes found.");
      return;
    }

    try {
      const response: any = await updateProfile({
        name: trimmedName,
      }).unwrap();

      toast.success(response?.message || "Profile updated successfully.");
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          "Failed to update profile."
      );
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result as string;
      setPreviewAvatar(base64);

      try {
        const response: any = await updateAvatar(base64).unwrap();

        toast.success(response?.message || "Avatar updated successfully.");
        setPreviewAvatar(null);
      } catch (error: any) {
        toast.error(
          error?.data?.message ||
            error?.data?.error ||
            "Avatar upload failed. Please check Cloudinary configuration."
        );
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read selected image.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full px-4 800px:px-10">
      <div className="mb-8">
        <h1 className="text-[28px] font-Poppins font-[700] text-black dark:text-white">
          My Profile
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Manage your personal information and profile picture.
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-5 800px:p-8">
        <div className="flex flex-col 800px:flex-row 800px:items-center gap-6">
          <div className="relative w-fit">
            <Image
              src={userAvatar}
              alt="profile avatar"
              width={120}
              height={120}
              className="w-[120px] h-[120px] rounded-full object-cover border border-gray-200 dark:border-[#ffffff1d]"
            />

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 px-3 py-2 rounded-lg bg-[#37a39a] text-white text-[12px] font-semibold cursor-pointer shadow-md"
            >
              {isUpdatingAvatar ? "..." : "Edit"}
            </label>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUpdatingAvatar}
              className="hidden"
            />
          </div>

          <div>
            <h2 className="text-[24px] font-Poppins font-[700] text-black dark:text-white">
              {user?.name || "User"}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {user?.email || ""}
            </p>

            <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-2">
              Role: {user?.role || "user"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5">
          <div>
            <label className="block text-[15px] font-semibold text-black dark:text-white mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-5 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-white dark:bg-slate-950 text-black dark:text-white outline-none focus:border-[#37a39a]"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-[15px] font-semibold text-black dark:text-white mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-5 py-4 rounded-lg border border-gray-300 dark:border-[#ffffff1d] bg-gray-100 dark:bg-slate-800 text-gray-500 outline-none cursor-not-allowed"
            />

            <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-2">
              Email address cannot be changed from this page.
            </p>
          </div>

          <button
            onClick={handleProfileUpdate}
            disabled={isUpdatingProfile}
            className={`w-full 800px:w-fit px-8 py-3 rounded-lg text-white font-semibold transition ${
              isUpdatingProfile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#37a39a] hover:opacity-90"
            }`}
          >
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineBell, HiCheck, HiCheckCircle } from "react-icons/hi";
import { BsCircleFill } from "react-icons/bs";
import { format } from "timeago.js";
import {
  useGetNotificationsQuery,
  useUpdateNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Props = Record<string, never>;

const NotificationBell: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data, refetch } = useGetNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });
  const [updateNotificationStatus, { isSuccess }] = useUpdateNotificationStatusMutation();
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications.filter((item: any) => item.status === "unread"));
    }
    if (isSuccess) refetch();
  }, [data, isSuccess, refetch]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleMarkAsRead = async (id: string, link?: string) => {
    await updateNotificationStatus(id);
    if (link) {
      router.push(link);
      setOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    await Promise.all(notifications.map((n) => updateNotificationStatus(n._id)));
  };

  const unreadCount = notifications.length;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-primary/10 hover:text-primary dark:hover:text-primary transition-all duration-200"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <IoMdNotificationsOutline size={22} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-0.5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white leading-none"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-[360px] bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/8 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl overflow-hidden z-[9999]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <HiOutlineBell className="text-primary text-lg" />
                <h6 className="text-sm font-semibold text-gray-800 dark:text-white font-Poppins">
                  Notifications
                </h6>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primaryDark font-semibold transition-colors font-Inter"
                >
                  <HiCheck size={14} />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[380px] overflow-y-auto">
              {unreadCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <HiCheckCircle className="text-2xl text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-Poppins">
                    All caught up!
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1 font-Inter">
                    No new notifications
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {notifications.map((item: any, index: number) => (
                    <motion.div
                      key={item._id || index}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex gap-3 px-4 py-3 hover:bg-primary/5 dark:hover:bg-primary/5 transition-colors duration-150 group cursor-pointer border-b border-gray-50 dark:border-white/5 last:border-0"
                      onClick={() => handleMarkAsRead(item._id, item.link)}
                    >
                      {/* Unread dot */}
                      <div className="flex-shrink-0 mt-1.5">
                        <BsCircleFill className="text-[7px] text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 font-Poppins leading-snug truncate">
                            {item.title}
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMarkAsRead(item._id); }}
                            className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-xs text-primary hover:text-primaryDark font-semibold transition-all duration-200 font-Inter whitespace-nowrap"
                          >
                            ✓ Read
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed font-Inter">
                          {item.message}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1.5 font-Inter">
                          {format(item.createdAt)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {unreadCount > 0 && (
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 font-Inter">
                  Click a notification to mark as read and navigate
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;

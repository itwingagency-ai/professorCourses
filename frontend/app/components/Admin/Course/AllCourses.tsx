/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC, useEffect, useState } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal, Typography } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi"
import { useDeleteCourseMutation, useGetAdminAllCoursesQuery, useUpdateCourseStatusMutation } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js';
import toast from 'react-hot-toast';
import Link from 'next/link';
type Props = {}

const AllCourses: FC<Props> = () => {
    const { theme, setTheme } = useTheme();
    const { isLoading, data, error, refetch } = useGetAdminAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    const [open, setOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [courseId, setCourseId] = useState("");
    const [deleteCourse, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteCourseMutation();
    const [updateStatus, { isSuccess: statusSuccess, error: statusError }] = useUpdateCourseStatusMutation();
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Course Name", flex: 1 },
        { field: "ratings", headerName: "Ratings", flex: .5 },
        { field: "purchased", headerName: "Purchased", flex: .5 },
        { field: "status", headerName: "Status", flex: 0.5 },
        { field: "created_at", headerName: "Created At", flex: 0.5, },
        {
            field: "  ", // 2 spaces
            headerName: "Edit",
            flex: 0.2,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderCell: (params: any) => {
                return (
                    <>
                        <Link href={`/admin/edit-course/${params.row.id}`} >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%", // Ensures full height of the cell
                                    width: "100%",
                                }}
                            >
                                <FiEdit2
                                    className="dark:text-white text-black"
                                    size={15}
                                />
                            </Box>
                        </Link >
                    </>
                );
            },
        },
        {
            field: " ", // 1 space
            headerName: "Delete",
            flex: 0.2,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderCell: (params: any) => {
                return (
                    <>
                        <Button
                            onClick={() => {
                                setOpen(!open)// toggle open state
                                setCourseId(params.row.id);
                            }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%", // Ensures full height of the cell
                                    width: "100%",
                                }}
                            >
                                <AiOutlineDelete
                                    className="dark:text-white text-black"
                                    size={15}
                                />
                            </Box>
                        </Button >
                    </>
                );
            },
        },
        {
            field: "students",
            headerName: "Students",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <Link href={`/admin/courses/${params.row.id}/students`}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                width: "100%",
                            }}
                        >
                            <AiOutlineEye
                                className="dark:text-white text-black"
                                size={20}
                            />
                        </Box>
                    </Link>
                );
            },
        },
        {
            field: "approval",
            headerName: "Approval",
            flex: 0.6,
            renderCell: (params: any) => {
                if (params.row.status === "published") {
                    return (
                        <div className="flex h-full items-center">
                            <span className="text-green-500 text-xs font-bold">Published</span>
                        </div>
                    );
                }
                return (
                    <div className="flex gap-2 h-full items-center">
                        <button
                            onClick={() => updateStatus({ id: params.row.id, status: "published" })}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => {
                                setCourseId(params.row.id);
                                setRejectionReason("");
                                setStatusModalOpen(true);
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                            Reject
                        </button>
                    </div>
                );
            }
        },
    ];

    const rows: any = [];
    {
        const courses = data?.courses || data?.course || [];
        courses.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                ratings: item.ratings,
                purchased: item.purchased,
                status: item.status || "published",
                created_at: format(item.createdAt),
            });
        });
    }
    // use effect for delete Course
    useEffect(() => {
        if (deleteError) {
            if ("data" in deleteError) {
                const errorMessage = deleteError as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (deleteSuccess) {
            refetch();
            toast.success("Course Deleted successfully");
            setOpen(false);
        }
    }, [deleteSuccess, deleteError, refetch]);

    useEffect(() => {
        if (statusError) {
            if ("data" in statusError) {
                const errorMessage = statusError as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (statusSuccess) {
            refetch();
            toast.success("Course status updated successfully");
            setStatusModalOpen(false);
        }
    }, [statusSuccess, statusError, refetch]);

    const handleReject = async () => {
        if (!rejectionReason) {
            toast.error("Please provide a rejection reason");
            return;
        }
        await updateStatus({ id: courseId, status: "rejected", rejectionReason });
    }

    const handleDelete = async () => {
        const id = courseId;
        await deleteCourse(id);
    }
    return (
        <div className="mt-[120px] ml-[90px] mr-[15px]">
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <Box m="20px">
                        <Box
                            m="40px 0 0 0"
                            height="80vh"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                    outline: "none",
                                },
                                "& .MuiDataGrid-columnHeader": {
                                    backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC", // Dark/Light header background
                                    borderBottom: "1px solid",
                                    borderBottomColor: theme === "dark" ? "#334155" : "#d1d5db",
                                    color: theme === "dark" ? "#f9fafb" : "#1f2937", // Dark/Light text color
                                    fontWeight: "bold",
                                },
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    color: theme === "dark" ? "#f9fafb !important" : "#111827 !important", // Ensures visibility
                                },
                                "& .MuiDataGrid-sortIcon": {
                                    color: theme === "dark" ? "#f9fafb" : "#111827",
                                },
                                "& .MuiDataGrid-row": {
                                    color: theme === "dark" ? "#e5e7eb" : "#1f2937",
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb",
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                    borderTop: theme === "dark"
                                        ? "1px solid #334155"
                                        : "1px solid #d1d5db",
                                    color: theme === "dark" ? "#f9fafb" : "#1f2937",
                                },
                                "& .MuiCheckbox-root": {
                                    color: theme === "dark" ? "#10b981 !important" : "#1f2937 !important",
                                },
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                    color: theme === "dark" ? `#fff !important` : `#1f2937 !important`,
                                },
                            }}
                        >
                            <DataGrid rows={rows} columns={columns} />
                        </Box>
                        {/* Modal for delete confirmation */}
                        {open && (
                            <Modal
                                open={open}
                                onClose={() => setOpen(false)}
                                aria-labelledby="delete-modal-title"
                                aria-describedby="delete-modal-description"
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 400,
                                        bgcolor: "background.paper",
                                        boxShadow: 24,
                                        p: 4,
                                        borderRadius: 2,
                                        textAlign: "center",
                                    }}
                                >
                                    {/* Modal Content */}
                                    <Typography id="delete-modal-title" variant="h6" component="h2" className="text-black">
                                        Confirm Deletion
                                    </Typography>
                                    <Typography
                                        id="delete-modal-description"
                                        sx={{ mt: 2, mb: 3, color: "gray" }}
                                    >
                                        Are you sure you want to delete this Course? This action cannot be undone.
                                    </Typography>

                                    {/* Buttons */}
                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => setOpen(!open)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            </Modal>
                        )}
                        {/* Modal for rejecting course */}
                        {statusModalOpen && (
                            <Modal
                                open={statusModalOpen}
                                onClose={() => setStatusModalOpen(false)}
                                aria-labelledby="reject-modal-title"
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 400,
                                        bgcolor: "background.paper",
                                        boxShadow: 24,
                                        p: 4,
                                        borderRadius: 2,
                                    }}
                                    className="dark:bg-[#111C43]"
                                >
                                    <Typography id="reject-modal-title" variant="h6" component="h2" className="text-black dark:text-white mb-4">
                                        Reject Course
                                    </Typography>
                                    <textarea
                                        placeholder="Enter rejection reason..."
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-black dark:text-white mb-4"
                                        rows={4}
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                    />
                                    <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => setStatusModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={handleReject}
                                        >
                                            Reject
                                        </Button>
                                    </Box>
                                </Box>
                            </Modal>
                        )}
                    </Box>
                )
            }
        </div>
    )
}

export default AllCourses;
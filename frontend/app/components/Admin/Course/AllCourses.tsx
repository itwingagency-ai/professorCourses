import React, { FC, useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Modal, Typography } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye, AiFillStar, AiOutlineStar, AiOutlineHistory } from 'react-icons/ai';
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi"
import { 
    useDeleteCourseMutation, 
    useGetAdminAllCoursesQuery, 
    useUpdateCourseStatusMutation,
    useToggleFeaturedCourseMutation 
} from '@/redux/features/courses/coursesApi';
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
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<any[]>([]);
    const [selectedCourseName, setSelectedCourseName] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [courseId, setCourseId] = useState("");
    const [deleteCourse, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteCourseMutation();
    const [updateStatus, { isSuccess: statusSuccess, error: statusError }] = useUpdateCourseStatusMutation();
    const [toggleFeatured, { isSuccess: featuredSuccess, error: featuredError }] = useToggleFeaturedCourseMutation();
    const columns = [
        { field: "id", headerName: "ID", flex: 0.3 },
        { field: "name", headerName: "Course Name", flex: 0.8 },
        { field: "ratings", headerName: "Ratings", flex: 0.2 },
        { field: "purchased", headerName: "Purchased", flex: 0.2 },
        { 
            field: "status", 
            headerName: "Status", 
            flex: 0.3,
            renderCell: (params: any) => {
                const status = params.row.status;
                let bgClass = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
                if (status === "published") bgClass = "bg-green-500/10 text-green-500 border border-green-500/20";
                else if (status === "pending") bgClass = "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
                else if (status === "rejected") bgClass = "bg-red-500/10 text-red-500 border border-red-500/20";
                else if (status === "archived") bgClass = "bg-gray-500/10 text-gray-500 border border-gray-500/20";
                
                return (
                    <div className="flex h-full items-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${bgClass}`}>
                            {status}
                        </span>
                    </div>
                );
            }
        },
        {
            field: "isFeatured",
            headerName: "Featured",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <div className="flex h-full items-center justify-center">
                        <button
                            onClick={async () => {
                                await toggleFeatured(params.row.id);
                            }}
                            className="focus:outline-none transition-transform active:scale-95"
                        >
                            {params.row.isFeatured ? (
                                <AiFillStar className="text-yellow-500" size={20} />
                            ) : (
                                <AiOutlineStar className="text-gray-400 dark:text-gray-500 hover:text-yellow-500" size={20} />
                            )}
                        </button>
                    </div>
                );
            }
        },
        {
            field: "changeStatus",
            headerName: "Update Status",
            flex: 0.4,
            renderCell: (params: any) => {
                return (
                    <div className="flex h-full items-center">
                        <select
                            value={params.row.status}
                            onChange={(e) => {
                                const newStatus = e.target.value;
                                if (newStatus === "rejected") {
                                    setCourseId(params.row.id);
                                    setRejectionReason("");
                                    setStatusModalOpen(true);
                                } else {
                                    updateStatus({ id: params.row.id, status: newStatus });
                                }
                            }}
                            className="bg-transparent dark:bg-gray-850 text-black dark:text-white border border-gray-300 dark:border-white/10 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                            <option value="draft" className="dark:bg-[#111C43]">Draft</option>
                            <option value="pending" className="dark:bg-[#111C43]">Pending</option>
                            <option value="published" className="dark:bg-[#111C43]">Published</option>
                            <option value="rejected" className="dark:bg-[#111C43]">Rejected</option>
                            <option value="archived" className="dark:bg-[#111C43]">Archived</option>
                        </select>
                    </div>
                );
            }
        },
        {
            field: "history",
            headerName: "History",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <div className="flex h-full items-center justify-center">
                        <button
                            onClick={() => {
                                setSelectedHistory(params.row.approvalHistory);
                                setSelectedCourseName(params.row.name);
                                setHistoryModalOpen(true);
                            }}
                            className="focus:outline-none text-black dark:text-white hover:text-[#37a39a] transition-colors"
                            title="View Status History"
                        >
                            <AiOutlineHistory size={20} />
                        </button>
                    </div>
                );
            }
        },
        { field: "created_at", headerName: "Created At", flex: 0.3 },
        {
            field: "edit",
            headerName: "Edit",
            flex: 0.15,
            renderCell: (params: any) => {
                return (
                    <Link href={`/admin/edit-course/${params.row.id}`} className="flex h-full items-center justify-center">
                        <FiEdit2 className="dark:text-white text-black hover:text-[#37a39a] transition-colors" size={15} />
                    </Link>
                );
            },
        },
        {
            field: "archive",
            headerName: "Archive",
            flex: 0.15,
            renderCell: (params: any) => {
                return (
                    <button
                        onClick={() => {
                            setOpen(true);
                            setCourseId(params.row.id);
                        }}
                        className="flex h-full items-center justify-center w-full focus:outline-none"
                    >
                        <AiOutlineDelete className="dark:text-white text-black hover:text-red-500 transition-colors" size={15} />
                    </button>
                );
            },
        },
        {
            field: "students",
            headerName: "Students",
            flex: 0.15,
            renderCell: (params: any) => {
                return (
                    <Link href={`/admin/courses/${params.row.id}/students`} className="flex h-full items-center justify-center">
                        <AiOutlineEye className="dark:text-white text-black hover:text-[#37a39a] transition-colors" size={20} />
                    </Link>
                );
            },
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
                isFeatured: item.isFeatured || false,
                approvalHistory: item.approvalHistory || [],
                rejectionReason: item.rejectionReason || "",
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
            toast.success("Course Archived successfully");
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

    useEffect(() => {
        if (featuredError) {
            if ("data" in featuredError) {
                const errorMessage = featuredError as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (featuredSuccess) {
            refetch();
            toast.success("Course featured status updated!");
        }
    }, [featuredSuccess, featuredError, refetch]);

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
                            <DataGrid 
                                rows={rows} 
                                columns={columns} 
                                slots={{ toolbar: GridToolbar }}
                                slotProps={{
                                    toolbar: {
                                        showQuickFilter: true,
                                        quickFilterProps: { debounceMs: 500 },
                                    },
                                }}
                            />
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
                                        Confirm Archiving
                                    </Typography>
                                    <Typography
                                        id="delete-modal-description"
                                        sx={{ mt: 2, mb: 3, color: "gray" }}
                                    >
                                        Are you sure you want to archive this Course? This will soft-delete the course and remove it from public listings.
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
                                            Archive
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
                        {/* Modal for approval history */}
                        {historyModalOpen && (
                            <Modal
                                open={historyModalOpen}
                                onClose={() => setHistoryModalOpen(false)}
                                aria-labelledby="history-modal-title"
                            >
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        width: 500,
                                        maxHeight: "80vh",
                                        overflowY: "auto",
                                        bgcolor: "background.paper",
                                        boxShadow: 24,
                                        p: 4,
                                        borderRadius: 2,
                                    }}
                                    className="dark:bg-[#111C43]"
                                >
                                    <Typography id="history-modal-title" variant="h6" component="h2" className="text-black dark:text-white mb-4 font-Poppins font-semibold border-b pb-2 dark:border-white/10">
                                        Status History: {selectedCourseName}
                                    </Typography>
                                    <div className="space-y-4">
                                        {selectedHistory && selectedHistory.length > 0 ? (
                                            selectedHistory.map((log: any, index: number) => (
                                                <div key={index} className="border-l-2 border-[#37a39a] pl-4 py-1 relative">
                                                    <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-[#37a39a]" />
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-sm font-bold uppercase text-[#37a39a]">{log.status}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(log.changedAt).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-800 dark:text-gray-300">
                                                        <span className="font-semibold text-xs text-gray-500 dark:text-gray-400">By:</span> {log.changedBy}
                                                    </p>
                                                    {log.reason && (
                                                        <p className="text-sm text-gray-700 dark:text-gray-400 mt-1 italic">
                                                            "{log.reason}"
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No history available for this course.</p>
                                        )}
                                    </div>
                                    <Box sx={{ display: "flex", justifyContent: "end", mt: 4 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => setHistoryModalOpen(false)}
                                        >
                                            Close
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
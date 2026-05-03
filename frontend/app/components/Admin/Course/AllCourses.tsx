/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC, useEffect, useState } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal, Typography } from "@mui/material";
import { AiOutlineDelete } from 'react-icons/ai';
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi"
import { useDeleteCourseMutation, useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js';
import toast from 'react-hot-toast';
import Link from 'next/link';
type Props = {}

const AllCourses: FC<Props> = () => {
    const { theme, setTheme } = useTheme();
    const { isLoading, data, error, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });
    const [open, setOpen] = useState(false);
    const [courseId, setCourseId] = useState("");
    const [deleteCourse, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteCourseMutation();
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Course Name", flex: 1 },
        { field: "ratings", headerName: "Ratings", flex: .5 },
        { field: "purchased", headerName: "Purchased", flex: .5 },
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
    ];

    const rows: any = [];
    {
        data && data.course.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                ratings: item.ratings,
                purchased: item.purchased,
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
    }, [deleteSuccess, deleteError]);

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
                    </Box>
                )
            }
        </div>
    )
}

export default AllCourses;
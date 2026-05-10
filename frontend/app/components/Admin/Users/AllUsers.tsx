/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC, useEffect, useState } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography, Modal } from '@mui/material';
import { AiOutlineDelete, AiOutlineMail, AiOutlineEye } from 'react-icons/ai';
import { useTheme } from "next-themes";
import Link from 'next/link';
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js';
import { useDeleteUserMutation, useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { styles } from '@/app/styles/style';
import toast from 'react-hot-toast';
type Props = {
    isTeam: boolean;
}

const AllUsers: FC<Props> = ({ isTeam }) => {
    const { theme, setTheme } = useTheme();
    const [active, setActive] = useState(false);
    const [email, setemail] = useState("");
    const [role, setRole] = useState("admin");
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");
    // const [updateUserRole, {error:updateError, isSuccess}] = useUpdateUserRoleMutation();
    const { isLoading, data, error, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
    const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] = useDeleteUserMutation({});
    // use effect for userRoleUpdate
    {/** 
        useEffect(() =>{
        if(updateError){
            if("data" in updateError){
                const errorMessage = updateError as any;
                toast.error(errorMessage.data.message);
            }
        }
        if(isSuccess){
        refetch();
            toast.success("User role updated successfully");
            setActive(false);
        }
    },[updateError, isSuccess]); */}

    // use effect for delete user
    useEffect(() => {
        if (deleteError) {
            if ("data" in deleteError) {
                const errorMessage = deleteError as any;
                toast.error(errorMessage.data.message);
            }
        }
        if (deleteSuccess) {
            refetch();
            toast.success("User Deleted successfully");
            setOpen(false);
        }
    }, [deleteSuccess, deleteError]);


    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 0.5 },
        { field: "email", headerName: "Email", flex: 0.7 },
        { field: "role", headerName: "Role", flex: 0.5 },
        { field: "courses", headerName: "Purchased Courses", flex: 0.5 },
        { field: "created_at", headerName: "Joined At", flex: 0.5, },

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
                                setOpen(!open)
                                setUserId(params.row.id);
                            }}
                        >
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
            field: "  ", // 2 spaces
            headerName: "Email",
            flex: 0.2,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderCell: (params: any) => {
                return (
                    <>
                        <a href={`mailto:${params.row.email}`}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%", // Ensures full height of the cell
                                    width: "100%",
                                }}
                            >
                                <AiOutlineMail
                                    className="dark:text-white text-black"
                                    size={15}
                                />
                            </Box>
                        </a >
                    </>
                );
            },
        },
        {
            field: "details",
            headerName: "View Details",
            flex: 0.2,
            renderCell: (params: any) => {
                return (
                    <Link href={`/admin/users/${params.row.id}`}>
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
    ];

    const rows: any = [];
    if (isTeam) {
        const newData = data && data.users.filter((item: any,) => item.role === "admin");
        newData && newData.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses.length,
                created_at: format(item.createdAt),
            });
        });
    } else {
        data && data?.users.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses.length,
                created_at: format(item.createdAt),
            });
        });
    }
const handleDelete = async () =>{
    const id = userId;
    await deleteUser(id);
}
    return (
        <div className="mt-[120px] ml-[90px] mr-[15px]">
            {
                isLoading ? (
                    <Loader />
                ) : (
                    <Box m="20px">
                        {isTeam && (
                            <div className="w-full flex justify-end">
                                <div className={`${styles.button} !w-[220px] dark:bg-[#57c7a3] !h-[34px] dark:border dark:border-[#ffffff6c]`}
                                    onClick={() => setActive(!active)}
                                >
                                    Add New Member
                                </div>
                            </div>
                        )}
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
                                        Are you sure you want to delete this user? This action cannot be undone.
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

export default AllUsers;
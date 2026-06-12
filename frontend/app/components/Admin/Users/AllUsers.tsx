/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC, useEffect, useState } from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, Typography, Modal } from '@mui/material';
import { AiOutlineDelete, AiOutlineMail, AiOutlineEye } from 'react-icons/ai';
import { useTheme } from "next-themes";
import Link from 'next/link';
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js';
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation, useBlockUserMutation, useUnblockUserMutation } from '@/redux/features/user/userApi';
import { useSelector } from 'react-redux';
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
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmType, setConfirmType] = useState<"delete" | "block" | "unblock">("delete");
    const [userId, setUserId] = useState("");
    const { user: currentUser } = useSelector((state: any) => state.auth);
    const [updateUserRole, { error: updateError, isSuccess }] = useUpdateUserRoleMutation();
    const { isLoading, data, error, refetch } = useGetAllUsersQuery({}, { refetchOnMountOrArgChange: true });
    const [deleteUser, { isSuccess: deleteSuccess, error: deleteError, isLoading: deleteLoading }] = useDeleteUserMutation({});
    const [blockUser, { isSuccess: blockSuccess, error: blockError, isLoading: blockLoading }] = useBlockUserMutation();
    const [unblockUser, { isSuccess: unblockSuccess, error: unblockError, isLoading: unblockLoading }] = useUnblockUserMutation();
    
    // use effect for userRoleUpdate
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
    }, [updateError, isSuccess, refetch]);

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
            setConfirmOpen(false);
        }
    }, [deleteSuccess, deleteError]);

    // use effect for block user
    useEffect(() => {
        if (blockError) {
            const err = blockError as any;
            toast.error(err?.data?.message || "Failed to block user");
        }
        if (blockSuccess) {
            refetch();
            toast.success("User blocked successfully");
            setConfirmOpen(false);
        }
    }, [blockSuccess, blockError]);

    // use effect for unblock user
    useEffect(() => {
        if (unblockError) {
            const err = unblockError as any;
            toast.error(err?.data?.message || "Failed to unblock user");
        }
        if (unblockSuccess) {
            refetch();
            toast.success("User unblocked successfully");
            setConfirmOpen(false);
        }
    }, [unblockSuccess, unblockError]);


    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 0.5 },
        { field: "email", headerName: "Email", flex: 0.7 },
        { field: "role", headerName: "Role", flex: 0.3 },
        { field: "courses", headerName: "Purchased Courses", flex: 0.3 },
        { 
            field: "status", 
            headerName: "Status", 
            flex: 0.3,
            renderCell: (params: any) => {
                const status = params.row.status || "active";
                let colorClass = "bg-green-500/10 text-green-500 border-green-500/20";
                if (status === "blocked") colorClass = "bg-red-500/10 text-red-500 border-red-500/20";
                else if (status === "pending") colorClass = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
                else if (status === "suspended") colorClass = "bg-orange-500/10 text-orange-500 border-orange-500/20";
                
                return (
                    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${colorClass}`}>
                            {status}
                        </span>
                    </Box>
                );
            }
        },
        { 
            field: "lastLogin", 
            headerName: "Last Login", 
            flex: 0.4,
            renderCell: (params: any) => {
                return (
                    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        <span className="text-sm">
                            {params.row.lastLogin ? format(params.row.lastLogin) : "Never"}
                        </span>
                    </Box>
                );
            }
        },
        { field: "created_at", headerName: "Joined At", flex: 0.4, },

        {
            field: " ", // 1 space
            headerName: "Delete",
            flex: 0.15,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            renderCell: (params: any) => {
                if (currentUser?._id === params.row.id) {
                    return null; // Don't show delete for yourself
                }
                return (
                    <>
                        <Button
                            onClick={() => {
                                setUserId(params.row.id);
                                setConfirmType("delete");
                                setConfirmOpen(true);
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
            flex: 0.15,
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
            field: "statusActions",
            headerName: "Block/Unblock",
            flex: 0.35,
            renderCell: (params: any) => {
                if (currentUser?._id === params.row.id) {
                    return null;
                }
                const isBlocked = params.row.status === "blocked" || params.row.status === "suspended";
                return (
                    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        {isBlocked ? (
                            <button
                                onClick={() => {
                                    setUserId(params.row.id);
                                    setConfirmType("unblock");
                                    setConfirmOpen(true);
                                }}
                                className="text-[10px] bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white px-2 py-1 rounded transition-colors font-Poppins"
                            >
                                Unblock
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setUserId(params.row.id);
                                    setConfirmType("block");
                                    setConfirmOpen(true);
                                }}
                                className="text-[10px] bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded transition-colors font-Poppins"
                            >
                                Block
                            </button>
                        )}
                    </Box>
                );
            }
        },
        {
            field: "details",
            headerName: "Details",
            flex: 0.15,
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
        {
            field: "actions",
            headerName: "Role Actions",
            flex: 0.5,
            renderCell: (params: any) => {
                return (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", height: "100%" }}>
                        {params.row.role !== "admin" && (
                            <button
                                onClick={() => updateUserRole({ id: params.row.id, role: "admin" })}
                                className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                Make Admin
                            </button>
                        )}
                        {params.row.role !== "teacher" && (
                            <button
                                onClick={() => updateUserRole({ id: params.row.id, role: "teacher" })}
                                className="text-[10px] bg-green-500 text-white px-2 py-1 rounded"
                            >
                                Make Teacher
                            </button>
                        )}
                        {params.row.role !== "student" && (
                            <button
                                onClick={() => updateUserRole({ id: params.row.id, role: "student" })}
                                className="text-[10px] bg-gray-500 text-white px-2 py-1 rounded"
                            >
                                Make Student
                            </button>
                        )}
                    </Box>
                );
            }
        },
    ];

    const rows: any = [];
    if (isTeam) {
        const newData = data && data.users.filter((item: any) => item.role === "admin" || item.role === "teacher");
        newData && newData.forEach((item: any) => {
            rows.push({
                id: item._id,
                name: item.name,
                email: item.email,
                role: item.role,
                courses: item.courses?.length || 0,
                created_at: format(item.createdAt),
                status: item.status || "active",
                lastLogin: item.lastLoginAt,
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
                status: item.status || "active",
                lastLogin: item.lastLoginAt,
            });
        });
    }

    const handleConfirmAction = async () => {
        if (confirmType === "delete") {
            await deleteUser(userId);
        } else if (confirmType === "block") {
            await blockUser(userId);
        } else if (confirmType === "unblock") {
            await unblockUser(userId);
        }
    };

    const handleAddMember = async () => {
        const user = data?.users.find((u: any) => u.email === email);
        if (!user) {
            toast.error("User not found. Please ask the user to register first.");
            return;
        }
        await updateUserRole({ id: user._id, role });
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
                        {/* Modal for action confirmation */}
                        {confirmOpen && (
                            <Modal
                                open={confirmOpen}
                                onClose={() => setConfirmOpen(false)}
                                aria-labelledby="action-modal-title"
                                aria-describedby="action-modal-description"
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
                                    <Typography id="action-modal-title" variant="h6" component="h2" className="text-black">
                                        {confirmType === "delete" && "Confirm Deletion"}
                                        {confirmType === "block" && "Confirm Block"}
                                        {confirmType === "unblock" && "Confirm Unblock"}
                                    </Typography>
                                    <Typography
                                        id="action-modal-description"
                                        sx={{ mt: 2, mb: 3, color: "gray" }}
                                    >
                                        {confirmType === "delete" && "Are you sure you want to delete this user? This action cannot be undone."}
                                        {confirmType === "block" && "Are you sure you want to block this user? They will be logged out and cannot log back in."}
                                        {confirmType === "unblock" && "Are you sure you want to unblock this user? They will be allowed to log in again."}
                                    </Typography>

                                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => setConfirmOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color={confirmType === "delete" || confirmType === "block" ? "error" : "success"}
                                            onClick={handleConfirmAction}
                                            disabled={deleteLoading || blockLoading || unblockLoading}
                                        >
                                            {(deleteLoading || blockLoading || unblockLoading) ? "Processing..." : "Confirm"}
                                        </Button>
                                    </Box>
                                </Box>
                            </Modal>
                        )}
                        {/* Modal for adding a member */}
                        {active && (
                            <Modal
                                open={active}
                                onClose={() => setActive(false)}
                                aria-labelledby="add-member-modal-title"
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
                                    <Typography id="add-member-modal-title" variant="h6" component="h2" className="text-black dark:text-white mb-4">
                                        Add New Member
                                    </Typography>
                                    <input 
                                        type="email"
                                        placeholder="Enter user email"
                                        className={`${styles.input} mb-4 text-black dark:text-white`}
                                        value={email}
                                        onChange={(e) => setemail(e.target.value)}
                                    />
                                    <select
                                        className={`${styles.input} mb-4 text-black dark:text-white`}
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                    <Button variant="contained" className="w-full bg-[#57c7a3] hover:bg-[#46a88b]" onClick={handleAddMember}>
                                        Add Member
                                    </Button>
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
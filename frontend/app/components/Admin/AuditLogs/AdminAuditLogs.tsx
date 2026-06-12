import React, { FC } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from '@mui/material';
import { useTheme } from "next-themes";
import Loader from '../../Loader/Loader';
import { format } from 'timeago.js';
import { useGetAdminAuditLogsQuery } from '@/redux/features/admin/adminApi';

const AdminAuditLogs: FC = () => {
    const { theme } = useTheme();
    const { isLoading, data } = useGetAdminAuditLogsQuery(undefined, { refetchOnMountOrArgChange: true });

    const columns = [
        { field: "id", headerName: "Log ID", flex: 0.3 },
        { field: "adminId", headerName: "Admin ID", flex: 0.3 },
        { field: "actionType", headerName: "Action", flex: 0.3 },
        { field: "targetType", headerName: "Target", flex: 0.2 },
        { field: "description", headerName: "Description", flex: 0.6 },
        { 
            field: "createdAt", 
            headerName: "Time", 
            flex: 0.3,
            renderCell: (params: any) => {
                return (
                    <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                        <span className="text-sm">
                            {params.row.createdAt ? format(params.row.createdAt) : ""}
                        </span>
                    </Box>
                );
            }
        },
    ];

    const rows: any = [];
    if (data && data.logs) {
        data.logs.forEach((item: any) => {
            rows.push({
                id: item._id,
                adminId: item.adminId,
                actionType: item.actionType,
                targetType: item.targetType,
                description: item.description,
                createdAt: item.createdAt,
            });
        });
    }

    return (
        <div className="mt-[120px]">
            {isLoading ? (
                <Loader />
            ) : (
                <Box m="20px">
                    <h1 className="text-2xl font-Poppins dark:text-white text-black font-semibold pb-4">
                        System Audit Logs
                    </h1>
                    <Box
                        m="20px 0 0 0"
                        height="80vh"
                        sx={{
                            "& .MuiDataGrid-root": { border: "none", outline: "none" },
                            "& .MuiDataGrid-columnHeader": {
                                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                borderBottom: "1px solid",
                                borderBottomColor: theme === "dark" ? "#334155" : "#d1d5db",
                                color: theme === "dark" ? "#f9fafb" : "#1f2937",
                                fontWeight: "bold",
                            },
                            "& .MuiDataGrid-columnHeaderTitle": {
                                color: theme === "dark" ? "#f9fafb !important" : "#111827 !important",
                            },
                            "& .MuiDataGrid-sortIcon": { color: theme === "dark" ? "#f9fafb" : "#111827" },
                            "& .MuiDataGrid-row": { color: theme === "dark" ? "#e5e7eb" : "#1f2937" },
                            "& .MuiDataGrid-virtualScroller": { backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb" },
                            "& .MuiDataGrid-footerContainer": {
                                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                borderTop: theme === "dark" ? "1px solid #334155" : "1px solid #d1d5db",
                                color: theme === "dark" ? "#f9fafb" : "#1f2937",
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
                </Box>
            )}
        </div>
    )
}

export default AdminAuditLogs;

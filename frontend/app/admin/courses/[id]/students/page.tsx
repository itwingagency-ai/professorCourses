'use client';
import React from 'react';
import AdminSideBar from "../../../../components/Admin/sidebar/AdminSideBar";
import AdminProtected from '../../../../hooks/adminProtected';
import Heading from '../../../../utils/Heading';
import { useParams } from 'next/navigation';
import { useGetAdminCourseStudentsQuery } from '@/redux/features/admin/adminApi';
import Loader from '../../../../components/Loader/Loader';
import { styles } from '@/app/styles/style';
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { format } from 'timeago.js';

const CourseStudentsPage = () => {
    const params = useParams();
    const id = params?.id as string;
    const { theme } = useTheme();

    const { data, isLoading } = useGetAdminCourseStudentsQuery(id);
    const students = data?.students || [];

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 0.7 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "joined", headerName: "Joined At", flex: 0.5 },
    ];

    const rows = students.map((student: any) => ({
        id: student._id,
        name: student.name,
        email: student.email,
        joined: format(student.createdAt),
    }));

    return (
        <div>
            <AdminProtected>
                <Heading
                    title={`Admin - Course Students`}
                    description="List of students enrolled in this course"
                    keywords="Admin, Course, Students"
                />
                <div className="flex min-h-screen">
                    <div className="1500px:w-[16%] w-1/5">
                        <AdminSideBar />
                    </div>
                    <div className="w-[85%] p-8">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <div className="mt-[80px]">
                                <h1 className={`${styles.title} text-left mb-8`}>Enrolled Students</h1>
                                <Box
                                    m="40px 0 0 0"
                                    height="75vh"
                                    sx={{
                                        "& .MuiDataGrid-root": { border: "none", outline: "none" },
                                        "& .MuiDataGrid-columnHeader": {
                                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                            color: theme === "dark" ? "#fff" : "#000",
                                        },
                                        "& .MuiDataGrid-virtualScroller": {
                                            backgroundColor: theme === "dark" ? "#1f2937" : "#f9fafb",
                                        },
                                        "& .MuiDataGrid-footerContainer": {
                                            backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                                            color: theme === "dark" ? "#fff" : "#000",
                                        },
                                        "& .MuiDataGrid-row": {
                                            color: theme === "dark" ? "#fff" : "#000",
                                        },
                                    }}
                                >
                                    <DataGrid rows={rows} columns={columns} />
                                </Box>
                            </div>
                        )}
                    </div>
                </div>
            </AdminProtected>
        </div>
    );
};

export default CourseStudentsPage;

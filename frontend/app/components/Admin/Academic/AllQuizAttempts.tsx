import React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { useGetAllQuizAttemptsAdminQuery } from "@/redux/features/quiz/quizApi";
import { format } from "timeago.js";

const AllQuizAttempts = () => {
  const { theme } = useTheme();
  const { data, isLoading } = useGetAllQuizAttemptsAdminQuery();

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "student", headerName: "Student", flex: 0.8 },
    { field: "course", headerName: "Course", flex: 0.6 },
    { field: "quiz", headerName: "Quiz", flex: 0.8 },
    { field: "score", headerName: "Score (%)", flex: 0.4 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center h-full">
            <span className={params.row.passed ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
              {params.row.passed ? "Passed" : "Failed"}
            </span>
          </div>
        );
      },
    },
    { field: "attemptedAt", headerName: "Attempted At", flex: 0.5 },
  ];

  const rows: any = [];
  if (data && data.attempts) {
    data.attempts.forEach((item: any) => {
      rows.push({
        id: item._id,
        student: item.userId?.name || "Unknown",
        course: item.courseId?.name || "Unknown",
        quiz: item.quizId?.title || "Unknown",
        score: item.score?.toFixed(2) || 0,
        passed: item.passed,
        attemptedAt: format(item.attemptedAt),
      });
    });
  }

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none", outline: "none" },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": { color: theme === "dark" ? "#fff" : "#000" },
              "& .MuiDataGrid-sortIcon": { color: theme === "dark" ? "#fff" : "#000" },
              "& .MuiDataGrid-row": { color: theme === "dark" ? "#fff" : "#000", borderBottom: theme === "dark" ? "1px solid #ffffff30 !important" : "1px solid #ccc !important" },
              "& .MuiTablePagination-root": { color: theme === "dark" ? "#fff" : "#000" },
              "& .MuiDataGrid-cell": { borderBottom: "none" },
              "& .name-column--cell": { color: theme === "dark" ? "#fff" : "#000" },
              "& .MuiDataGrid-columnHeaders": { backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC", borderBottom: "none", color: theme === "dark" ? "#fff" : "#000" },
              "& .MuiDataGrid-virtualScroller": { backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0" },
              "& .MuiDataGrid-footerContainer": { color: theme === "dark" ? "#fff" : "#000", borderTop: "none", backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC" },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `#fff !important` },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} slots={{ toolbar: GridToolbar }} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllQuizAttempts;

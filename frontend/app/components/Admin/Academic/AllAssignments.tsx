import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { useGetAllAssignmentsAdminQuery, useArchiveAssignmentAdminMutation } from "@/redux/features/assignment/assignmentApi";
import toast from "react-hot-toast";
import { format } from "timeago.js";

const AllAssignments = () => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetAllAssignmentsAdminQuery();
  const [archiveAssignment, { isSuccess, error }] = useArchiveAssignmentAdminMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Assignment archive status updated");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        toast.error((error as any).data?.message || "Failed to update assignment");
      }
    }
  }, [isSuccess, error, refetch]);

  const handleArchive = async (id: string) => {
    if (window.confirm("Are you sure you want to change the archive status of this assignment?")) {
      await archiveAssignment(id);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Title", flex: 0.8 },
    { field: "course", headerName: "Course", flex: 0.6 },
    { field: "teacher", headerName: "Teacher", flex: 0.6 },
    { field: "totalMarks", headerName: "Total Marks", flex: 0.4 },
    { field: "dueDate", headerName: "Due Date", flex: 0.5 },
    { field: "createdAt", headerName: "Created At", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center h-full">
            <span className={params.row.isArchived ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>
              {params.row.isArchived ? "Archived" : "Active"}
            </span>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.4,
      renderCell: (params: any) => {
        return (
          <Button onClick={() => handleArchive(params.row.id)}>
            {params.row.isArchived ? "Restore" : "Archive"}
          </Button>
        );
      },
    },
  ];

  const rows: any = [];
  if (data && data.assignments) {
    data.assignments.forEach((item: any) => {
      rows.push({
        id: item._id,
        title: item.title,
        course: item.courseId?.name || "Unknown",
        teacher: item.createdBy?.name || "Unknown",
        totalMarks: item.totalMarks,
        dueDate: new Date(item.dueDate).toLocaleDateString(),
        createdAt: format(item.createdAt),
        isArchived: item.isArchived,
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

export default AllAssignments;

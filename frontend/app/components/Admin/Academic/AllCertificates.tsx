import React, { useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { useGetAllCertificatesAdminQuery, useRevokeCertificateAdminMutation, useRestoreCertificateAdminMutation } from "@/redux/features/certificate/certificateApi";
import toast from "react-hot-toast";
import { format } from "timeago.js";

const AllCertificates = () => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetAllCertificatesAdminQuery();
  const [revokeCertificate, { isSuccess: revokeSuccess, error: revokeError }] = useRevokeCertificateAdminMutation();
  const [restoreCertificate, { isSuccess: restoreSuccess, error: restoreError }] = useRestoreCertificateAdminMutation();

  useEffect(() => {
    if (revokeSuccess) {
      toast.success("Certificate revoked successfully");
      refetch();
    }
    if (revokeError) {
      if ("data" in revokeError) {
        toast.error((revokeError as any).data?.message || "Failed to revoke certificate");
      }
    }
  }, [revokeSuccess, revokeError, refetch]);

  useEffect(() => {
    if (restoreSuccess) {
      toast.success("Certificate restored successfully");
      refetch();
    }
    if (restoreError) {
      if ("data" in restoreError) {
        toast.error((restoreError as any).data?.message || "Failed to restore certificate");
      }
    }
  }, [restoreSuccess, restoreError, refetch]);

  const handleRevoke = async (id: string) => {
    if (window.confirm("Are you sure you want to revoke this certificate?")) {
      await revokeCertificate(id);
    }
  };

  const handleRestore = async (id: string) => {
    if (window.confirm("Are you sure you want to restore this certificate?")) {
      await restoreCertificate(id);
    }
  };

  const columns = [
    { field: "id", headerName: "Object ID", flex: 0.3 },
    { field: "certificateId", headerName: "Certificate ID", flex: 0.5 },
    { field: "student", headerName: "Student", flex: 0.7 },
    { field: "course", headerName: "Course", flex: 0.7 },
    { field: "issuedAt", headerName: "Issued At", flex: 0.5 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center h-full">
            <span className={params.row.status === "valid" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
              {params.row.status.toUpperCase()}
            </span>
          </div>
        );
      },
    },
    {
      field: "link",
      headerName: "Link",
      flex: 0.4,
      renderCell: (params: any) => {
        return (
          <a href={`/verify-certificate/${params.row.certificateId}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center h-full">
            Open
          </a>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.6,
      renderCell: (params: any) => {
        return (
          <div className="flex gap-2">
            {params.row.status === "valid" ? (
              <Button onClick={() => handleRevoke(params.row.id)} color="error">Revoke</Button>
            ) : (
              <Button onClick={() => handleRestore(params.row.id)} color="success">Restore</Button>
            )}
          </div>
        );
      },
    },
  ];

  const rows: any = [];
  if (data && data.certificates) {
    data.certificates.forEach((item: any) => {
      rows.push({
        id: item._id,
        certificateId: item.certificateId,
        student: item.userId?.name || "Unknown",
        course: item.courseId?.name || "Unknown",
        issuedAt: new Date(item.issuedAt).toLocaleDateString(),
        status: item.status,
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

export default AllCertificates;

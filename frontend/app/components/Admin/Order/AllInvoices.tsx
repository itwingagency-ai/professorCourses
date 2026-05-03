/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useState } from 'react'
import { DataGrid, GridToolbar, GridToolbarProps } from '@mui/x-data-grid';
import { useTheme } from 'next-themes';
import { Box, Toolbar } from '@mui/material';
import { useGetAllCoursesQuery } from '@/redux/features/courses/coursesApi';
import Loader from '../../Loader/Loader';
import { useGetAllOrdersQuery } from '@/redux/features/orders/ordersApi';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';
import { AiOutlineMail } from 'react-icons/ai';

type Props = {
  isDashboard?: boolean;
}

const AllInvoices: FC<Props> = ({ isDashboard }) => {
  const { theme, setTheme } = useTheme();
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: userData } = useGetAllUsersQuery({});
  const { data: courseData } = useGetAllCoursesQuery({});

  // order state
  const [orderData, setOrderData] = useState<any>([]);
console.log(courseData);
  useEffect(() => {
    if (data) {
      const temp = data.orders.map((item: any) => {
        const user = userData?.users?.find((user: any) => user._id === item.userId
        );
        const course = courseData?.course?.find((course: any) => course._id === item.courseId
        );
        return {
          ...item,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price: "$" + course?.price,
        }
      });
      setOrderData(temp);
    }
  }, [data, userData, courseData]);

  const columns: any = [
    { field: "id", HeaderName: "ID", flex: 0.3 },
    { field: "userName", HeaderName: "Name", flex: isDashboard ? .6 : .5 },
    ...(isDashboard
      ? []
      : [
        { field: "userEmail", HeaderName: "Email", flex: 1 },
        { field: "title", HeaderName: "Course Title", flex: 1 },
      ]),
    { field: "price", HeaderName: "Price", flex: 0.5 },
    ...(isDashboard
      ? [
        {
          field: "created_at", headerName: "Created At", flex: 0.5
        },
      ]
      : [
        {
          field: "",
          headerName: "Email",
          flex: 0.2,
          renderCell: (params: any) => {
            return (
              <a href={`mailto:${params.row.userEmail}`}>
                <AiOutlineMail
                  className=" dark:text-white text-black"
                />
              </a>
            );
          },
        },
      ]
    ),
  ];
  // mock data 
  const rows: any = [
    {
      id: "123456789798",
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      title: "3s Course",
      price: "$100",
      created_at: "2022-01-01",
    },
    {
      id: "123456789798",
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      title: "3s Course",
      price: "$100",
      created_at: "2022-01-01",
    },
    {
      id: "123456789798",
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      title: "3s Course",
      price: "$100",
      created_at: "2022-01-01",
    },
    {
      id: "123456789798",
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      title: "3s Course",
      price: "$100",
      created_at: "2022-01-01",
    },
    {
      id: "123456789798",
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      title: "3s Course",
      price: "$100",
      created_at: "2022-01-01",
    },
    {
      id: "123456789798",
      userName: "John Doe",
      userEmail: "john.doe@example.com",
      title: "3s Course",
      price: "$100",
      created_at: "2022-01-01",
    },
  ];

  orderData && orderData.forEach((item: any) => {
    rows.push({
      id: item._id,
      userName: item.userName,
      userEmail: item.userEmail,
      title: item.title,
      price: item.price,
      created_at: item.created_at,
    });
  });

  // const [rows, setRows] = useState<any[]>([]); // Initialize as empty array

  // useEffect(() => {
  //   if (data && userData && courseData) { // Check all data is available
  //     const temp = data.orders.map((item: any) => {
  //       const user = userData.users.find((user: any) => user._id === item.userId
  //       );
  //       const course = courseData.courses.find((course: any) => course._id === item.courseId
  //       );
  //       return {
  //         ...item,
  //         userName: user?.name,
  //         userEmail: user?.email,
  //         title: course?.name,
  //         price: "$" + course?.price,
  //       }
  //     });
  //     setRows(temp); // Update rows state with processed data
  //   }
  // }, [data, userData, courseData]);

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {
        isLoading ? (
          <Loader />
        ) : (
          <Box m={isDashboard ? "0" : "40px"} >
            <Box m={isDashboard ? "0" : "40px 0 0 0"}
              height={isDashboard ? "35vh" : "90vh"}
              overflow={"hidden"}
              sx={
                {
                  "& .MuiDataGrid-root": {
                    border: "none",
                    outline: "none",
                  },
                  "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-sortIcon": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-row": {
                    color: theme === "dark" ? "#fff" : "#000",
                    borderBottom:
                      theme === "dark"
                        ? "1px solid #ffffff30!important"
                        : "1px solid #ccc!important"
                  },
                  "& .MuiTablePagination-root": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .name-column--cell": {
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: theme === "dark" ? "#3e4396" : "#AAA9FC",
                    borderBottom: "none",
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: theme === "dark" ? "#3e4396" : "#AAA9FC",
                    borderBottom: "none",
                    color: theme === "dark" ? "#fff" : "#000",
                  },
                  "& .MuiCheckbox-root": {
                    color: theme === "dark" ? `#b73bde !important` : `#000 !important`,
                  },
                  "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `#fff !important`,
                  },
                }
              }
            >
              <DataGrid
                checkboxSelection={isDashboard ? false : true}
                rows={rows}
                columns={columns}
               // components={isDashboard ? {} : { Toolbar: GridToolbar }}
              />
            </Box>
          </Box>
        )
      }
    </div>
  )
}

export default AllInvoices;
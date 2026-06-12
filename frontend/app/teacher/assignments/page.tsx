"use client";
import React from "react";
import TeacherProtected from "../../../app/hooks/teacherProtected";
import Heading from "../../../app/utils/Heading";
import TeacherSideBar from "../../components/Teacher/sidebar/TeacherSideBar";
import TeacherDashboardHeader from "../../components/Teacher/TeacherDashboardHeader";
import TeacherAssignments from "../../components/Teacher/Course/Assignments/TeacherAssignments";

const Page = () => {
  return (
    <div>
      <TeacherProtected>
        <Heading
          title="Teacher Assignments - LMS"
          description="Manage assignments for your courses"
          keywords="Teacher, Assignments, LMS"
        />
        <div className="flex min-h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <TeacherSideBar />
          </div>
          <div className="w-[85%]">
            <TeacherDashboardHeader />
            <TeacherAssignments />
          </div>
        </div>
      </TeacherProtected>
    </div>
  );
};

export default Page;

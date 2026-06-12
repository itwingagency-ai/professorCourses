"use client";
import React from "react";
import TeacherProtected from "../../../app/hooks/teacherProtected";
import Heading from "../../../app/utils/Heading";
import TeacherSideBar from "../../components/Teacher/sidebar/TeacherSideBar";
import TeacherDashboardHeader from "../../components/Teacher/TeacherDashboardHeader";
import TeacherQuizzes from "../../components/Teacher/Course/Quizzes/TeacherQuizzes";

const Page = () => {
  return (
    <div>
      <TeacherProtected>
        <Heading
          title="Teacher Quizzes - LMS"
          description="Manage quizzes for your courses"
          keywords="Teacher, Quizzes, LMS"
        />
        <div className="flex min-h-screen">
          <div className="1500px:w-[16%] w-1/5">
            <TeacherSideBar />
          </div>
          <div className="w-[85%]">
            <TeacherDashboardHeader />
            <TeacherQuizzes />
          </div>
        </div>
      </TeacherProtected>
    </div>
  );
};

export default Page;

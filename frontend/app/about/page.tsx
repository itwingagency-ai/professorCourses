"use client";

import React, { FC, useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";

const AboutPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="About - 3S Consultant"
        description="About 3S Consultant LMS"
        keywords="about, LMS, education"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={2}
        setRoute={setRoute}
        route={route}
      />

      <section className="w-[92%] 800px:w-[80%] mx-auto py-16">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-8 800px:p-12">
          <h1 className="text-[34px] 800px:text-[46px] font-Poppins font-[700] text-black dark:text-white">
            About 3S Consultant
          </h1>

          <p className="text-[17px] text-gray-600 dark:text-gray-300 mt-5 leading-8">
            3S Consultant is an online learning platform designed to help students
            access structured courses, learning content, and skill-based education
            through a simple LMS experience.
          </p>

          <div className="grid grid-cols-1 800px:grid-cols-3 gap-5 mt-10">
            {["Quality Courses", "Student Support", "Practical Learning"].map((item) => (
              <div
                key={item}
                className="p-6 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-[#ffffff1d]"
              >
                <h2 className="text-[20px] font-semibold text-black dark:text-white">
                  {item}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Built to provide a smooth learning experience for normal users and students.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

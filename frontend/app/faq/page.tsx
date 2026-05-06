"use client";

import React, { FC, useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";

const faqs = [
  {
    q: "How do I enroll in a course?",
    a: "Create an account, login, open a course detail page, and click Enroll Now.",
  },
  {
    q: "Where can I see my enrolled courses?",
    a: "After login, open My Courses or Profile to view your enrolled courses.",
  },
  {
    q: "Can I access course content without enrollment?",
    a: "No. Full course content is only available after enrollment or purchase.",
  },
  {
    q: "Can I ask questions inside a course?",
    a: "Yes. The question section is part of the course learning page and will be connected in the next flow step.",
  },
];

const FAQPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="FAQ - 3S Consultant"
        description="Frequently asked questions"
        keywords="faq, help, LMS"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={4}
        setRoute={setRoute}
        route={route}
      />

      <section className="w-[92%] 800px:w-[75%] mx-auto py-16">
        <h1 className="text-[34px] 800px:text-[46px] font-Poppins font-[700] text-black dark:text-white text-center">
          Frequently Asked Questions
        </h1>

        <div className="mt-10 space-y-5">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d]"
            >
              <h2 className="text-[20px] font-semibold text-black dark:text-white">
                {faq.q}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-3">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQPage;

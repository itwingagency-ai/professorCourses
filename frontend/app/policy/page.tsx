"use client";

import React, { FC, useState } from "react";
import Header from "../components/Header";
import Heading from "../utils/Heading";

const PolicyPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");

  return (
    <div>
      <Heading
        title="Policy - 3S Consultant"
        description="Platform policy"
        keywords="policy, privacy, LMS"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={3}
        setRoute={setRoute}
        route={route}
      />

      <section className="w-[92%] 800px:w-[75%] mx-auto py-16">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-[#ffffff1d] p-8 800px:p-12">
          <h1 className="text-[34px] 800px:text-[46px] font-Poppins font-[700] text-black dark:text-white">
            Platform Policy
          </h1>

          <div className="mt-8 space-y-6 text-gray-600 dark:text-gray-300 leading-8">
            <p>
              This platform is designed for educational use. Users are expected
              to use course materials responsibly and follow platform rules.
            </p>

            <p>
              Course content is only accessible to enrolled users. Sharing paid
              or protected course content without permission is not allowed.
            </p>

            <p>
              User profile information is used only for account management,
              course enrollment, and learning activity inside the LMS.
            </p>

            <p>
              More detailed privacy, refund, and terms policies can be added
              later when payment gateway integration is finalized.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PolicyPage;

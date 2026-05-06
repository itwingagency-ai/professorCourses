"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Heading from "../utils/Heading";
import Protected from "../hooks/useprotected";
import Profile from "../components/Profile/Profile";

const Page: FC = () => {
  const [open, setOpen] = useState(false);
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);

  return (
    <Protected>
      <Heading
        title={`${user?.name || "Profile"} - 3S Consultant`}
        description="User profile"
        keywords="profile, LMS"
      />

      <Header
        open={open}
        setOpen={setOpen}
        activeItem={1}
        setRoute={setRoute}
        route={route}
      />

      <Profile user={user} />
    </Protected>
  );
};

export default Page;
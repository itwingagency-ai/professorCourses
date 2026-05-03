/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Route/Hero";
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props { }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setAactiveItem] = useState(0);
  // important for the popup
  const [route, setRoute] = useState("Login");
  return (
    <div>
      {/* calling the heading helper function from utils folder */}
      <Heading
        title="3S Consultant"
        description="Your trusted partner for digital transformation"
        keywords="Programming, MERN, Redux, Machine Learning"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />
      <Hero />
    </div>
  )
};

export default Page;
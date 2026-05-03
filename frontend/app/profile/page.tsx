/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
'use client'
import React, { FC, useState } from 'react'
import Header from '../components/Header';
import Protected from '../hooks/useprotected';
import Heading from '../utils/Heading';
import { useSelector } from 'react-redux';
import Profile from '../components/Profile/Profile';
type Props = {}

const page: FC<Props> = (props) => {

    const [open, setOpen] = useState(false);
    const [activeItem, setAactiveItem] = useState(0); // count from 0
    // important for the popup
    const [route, setRoute] = useState("Login");
    const { user } = useSelector((state: any) => state.auth);
    {/* we have created some cutome hooks in the app/hooksfolder for validating user, if user is logged in then he can access the profile page */ }
    return (
        <div>
            <Protected>
                {/* calling the heading helper function from utils folder */}
                <Heading
                    title={`${user?.name} profile - the3S`}
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
                <Profile user = {user}/>
            </Protected>
        </div>
    )
}

export default page;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector, UseSelector } from "react-redux";
export default function userAuth() {
    const { user } = useSelector((state: any) => state.auth);
    // if user is logged in then true otherwise false
    if (user) {
        return true
    } else {
        return false
    }
}
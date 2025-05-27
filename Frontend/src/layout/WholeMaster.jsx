import { Outlet, useNavigate } from "react-router-dom";
import WholeHeader from "./WholeHeader";
import WholeFooter from "./WholeFooter";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Layout() {


    const nav = useNavigate();
    useEffect(() => {
        const userType = sessionStorage.getItem("userType");
        const token = sessionStorage.getItem("token");

        if (!token) {
            toast.error("Session expired. Please log in again.");
            nav("/");
            return;
        }

        if (userType !== "2") {
            toast.error("You are not allowed to access this page.");
            nav("/");
        }
    }, []);

    return (
        <>
            <WholeHeader />
            <Outlet />
            <WholeFooter />
        </>


    )
}
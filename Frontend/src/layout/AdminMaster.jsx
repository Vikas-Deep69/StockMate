import AdminFooter from "./AdminFooter"
import AdminHeader from "./AdminHeader"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { toast } from "react-toastify";
export default function AdminMaster() {

    const nav = useNavigate();
    useEffect(() => {
        const userType = sessionStorage.getItem("userType");
        const token = sessionStorage.getItem("token");

        if (!token) {
            toast.error("Session expired. Please log in again.");
            nav("/");
            return;
        }

        if (userType !== "1") {
            toast.error("You are not allowed to access this page.");
            nav("/");
        }
    }, []);



    return (
        <>
            <AdminHeader />
            <Outlet />
            <AdminFooter />
        </>
    )
}
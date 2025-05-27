import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../services/apiService";

export default function WholeSalerDashboard() {

    const [dashboard, setDashboard] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        adminDashboard();
    }, []);

    const adminDashboard = () => {
        setLoading(true);
        apiService.wholeSalerDashboard({})
            .then((res) => {
                if (res.data.success) {
                    setDashboard(res.data.data);
                } else {
                    toast.error(res.data.message);
                }
                setLoading(false);
            })
            .catch((err) => {
                toast.error(err.message);
                setLoading(false);
            });
    };

    return (

        <>
            <section className="w-100">
                <div
                    className="text-light"
                    style={{
                        background: 'url("/assets/images/banner-1.jpg") no-repeat center center',
                        backgroundSize: "cover",
                        borderRadius: "20px",
                        overflow: "hidden",
                    }}
                >
                    <div className="container py-5">
                        <div className="row justify-content-center">
                            <div className="col-md-10 text-center">
                                <h2 className="display-4 fw-bold text-light">Welcome, {sessionStorage.getItem('name')}</h2>
                                <p className="lead">Manage your dashboard, monitor activity, and keep everything running smoothly.</p>
                            </div>
                        </div>

                        {/* Cards Section Below */}

                    </div>
                </div>

            </section>

            <section id="events" className="events section py-5">
    <div className="container">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h3>
        <div className="row g-4">

            {/* Total Products */}
            <div className="col-md-3">
                <div className="card border-primary border-2 shadow-sm h-100">
                    <div className="card-body text-center">
                        <i className="bi bi-box-seam text-primary fs-2 mb-2"></i>
                        <h5 className="card-title text-primary fw-semibold mb-2">Total Products</h5>
                        {dashboard.totalProducts}
                    </div>
                </div>
            </div>

            {/* Pending Requests */}
            <div className="col-md-3">
                <div className="card border-primary border-2 shadow-sm h-100">
                    <div className="card-body text-center">
                        <i className="bi bi-hourglass-split text-primary fs-2 mb-2"></i>
                        <h5 className="card-title text-primary fw-semibold mb-2">Pending Requests</h5>
                        {dashboard.pendingRequests}
                    </div>
                </div>
            </div>

            {/* Completed Payments */}
            <div className="col-md-3">
                <div className="card border-primary border-2 shadow-sm h-100">
                    <div className="card-body text-center">
                        <i className="bi bi-check-circle-fill text-primary fs-2 mb-2"></i>
                        <h5 className="card-title text-primary fw-semibold mb-2">Completed Payments</h5>
                        {dashboard.paidRequests}
                    </div>
                </div>
            </div>

            {/* Pending Payments */}
            <div className="col-md-3">
                <div className="card border-primary border-2 shadow-sm h-100">
                    <div className="card-body text-center">
                        <i className="bi bi-clock-history text-primary fs-2 mb-2"></i>
                        <h5 className="card-title text-primary fw-semibold mb-2">Pending Payments</h5>
                        {dashboard.pendingPayments}
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>




        </>
    )
}
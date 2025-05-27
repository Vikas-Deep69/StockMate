import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../services/apiService";
import Switch from "react-switch";
import { Link } from "react-router-dom";

export default function ViewWholesalers() {



    const [wholesellers, setWholesellers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        allWholesellers();
    }, []);


    const allWholesellers = () => {
        setLoading(true);
        apiService.allWholesalers({ status: true })
            .then((res) => {
                if (res.data.success) {
                    setWholesellers(res.data.data);
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
            {/* Header */}
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
                    <div className="container py-5 text-center">
                        <h2 className="display-4 fw-bold">View Wholesalers</h2>
                    </div>
                </div>
            </section>


            <section className="pb-5">
                <div className="container-lg">
                    <div className="row">
                        <div className="section-header d-flex flex-wrap justify-content-between my-4">
                            <h2 className="section-title">Top Wholesellers</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="product-grid row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5">

                                {wholesellers.length > 0 ? wholesellers.map((whole) => (

                                    <div className="col-md-4 mb-4" key={whole._id}>
                                        <Link to={'/shop/product/bywholesaler/'+whole.userId._id } style={{ textDecoration: 'none' }}>
                                            <div className="product-item border p-3 h-100">
                                                <figure className="text-center mb-3">
                                                    <a href={whole.profile || "#"} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={whole.profile || "/assets/images/no-profile.png"}
                                                            alt={whole.name}
                                                            className="img-fluid"
                                                            style={{
                                                                width: "150px",
                                                                height: "150px",

                                                                borderRadius: "50%",
                                                                border: "2px solid #dee2e6",
                                                            }}
                                                        />
                                                    </a>
                                                </figure>
                                                <div className="d-flex flex-column text-center">
                                                    <h5 className="fw-semibold mb-2">
                                                        <i className="bi bi-person-circle me-1 text-primary"></i>
                                                        {whole.name || "N/A"}
                                                    </h5>

                                                    <div className="mb-1 text-muted">
                                                        <i className="bi bi-envelope-fill me-1 text-primary"></i>
                                                        {whole.email || "N/A"}
                                                    </div>
                                                    <div className="mb-1 text-muted">
                                                        <i className="bi bi-telephone-fill me-1 text-success"></i>
                                                        {whole.contact || "N/A"}
                                                    </div>
                                                    <div className="text-muted">
                                                        <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
                                                        {whole.address || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>


                                )) : (
                                    <div className="col-12 text-center">
                                        No wholesellers found
                                    </div>
                                )}

                            </div>
                            {/* / product-grid */}
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

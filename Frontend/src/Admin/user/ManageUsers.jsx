import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import Switch from "react-switch";

export default function ManageUsers() {
    const [showTable, setShowTable] = useState("shopkeepers");
    const [shopkeepers, setShopkeepers] = useState([]);
    const [wholesellers, setWholesellers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        allShopkeepers();
        allWholesellers();
    }, []);

    const allShopkeepers = () => {
        setLoading(true);
        apiService.allShopkeepers({})
            .then((res) => {
                if (res.data.success) {
                    setShopkeepers(res.data.data);
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

    const allWholesellers = () => {
        setLoading(true);
        apiService.allWholesalers({})
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

    const handleVerify = (_id, request) => {
        if (showTable == 'shopkeepers') {
            setLoading(true);
            apiService.shopkeeperRequestStatus({ _id, request })
                .then((res) => {
                    if (res.data.success) {
                        toast.success(res.data.message);
                        allShopkeepers();
                        allWholesellers();
                    } else {
                        toast.error(res.data.message);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error(err.message);
                    setLoading(false);
                });
        }
        else {
            setLoading(true);
            apiService.wholesalerRequestStatus({ _id, request })
                .then((res) => {
                    if (res.data.success) {
                        toast.success(res.data.message);
                        allShopkeepers();
                        allWholesellers();
                    } else {
                        toast.error(res.data.message);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error(err.message);
                    setLoading(false);
                });
        }

    };



    const handleAccountStatus = (_id, status) => {
        if (showTable == 'shopkeepers') {
            setLoading(true);
            apiService.shopkeeperAccountStatus({ _id, status })
                .then((res) => {
                    if (res.data.success) {
                        toast.success(res.data.message);
                        allShopkeepers();
                        allWholesellers();
                    } else {
                        toast.error(res.data.message);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error(err.message);
                    setLoading(false);
                });
        }
        else {
            setLoading(true);
            apiService.wholesalerAccountStatus({ _id, status })
                .then((res) => {
                    if (res.data.success) {
                        toast.success(res.data.message);
                        allShopkeepers();
                        allWholesellers();
                    } else {
                        toast.error(res.data.message);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    toast.error(err.message);
                    setLoading(false);
                });
        }



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
                        <h2 className="display-4 fw-bold">Manage Users</h2>
                    </div>
                </div>
            </section>

            {/* Buttons */}
            <section className="py-5">
                <div className="container">
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h4 className="fw-bold text-dark mb-0">
                                    {showTable === "wholesellers" ? "Wholesellers" : "Shopkeepers"} Management
                                </h4>
                                <small className="text-muted">
                                    {showTable === "wholesellers"
                                        ? "Manage your wholesale partners"
                                        : "Manage your retail shopkeepers"}
                                </small>
                            </div>

                            <div className="btn-group shadow-sm" role="group">
                                <button
                                    className={`btn ${showTable === "shopkeepers" ? "btn-primary" : "btn-light"} px-4 py-2 border`}
                                    onClick={() => setShowTable("shopkeepers")}
                                >
                                    <i className="bi bi-shop me-2"></i>
                                    Shopkeepers
                                </button>
                                <button
                                    className={`btn ${showTable === "wholesellers" ? "btn-primary" : "btn-light"} px-4 py-2 border`}
                                    style={{
                                        borderTopRightRadius: "6px",
                                        borderBottomRightRadius: "6px",
                                        fontWeight: "500",
                                        border: "1px solid #dee2e6"
                                    }}
                                    onClick={() => setShowTable("wholesellers")}
                                >
                                    <i className="bi bi-boxes me-2"></i>
                                    Wholesellers
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Shopkeepers Table */}
                    {showTable === "shopkeepers" && (
                        <div className="card shadow-sm">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover table-bordered mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th className="text-center">Profile</th>
                                                <th>Contact Details</th>
                                                <th>Verification</th>
                                                <th>Status</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shopkeepers.map((shopK, idx) => (
                                                <tr key={shopK._id}>
                                                    <td>{idx + 1}</td>
                                                    <td>
                                                        <i className="bi bi-person-circle me-2 text-primary"></i>
                                                        {shopK.name || "N/A"}
                                                    </td>

                                                    <td className="text-center">
                                                        {shopK.profile ? (
                                                            <a href={shopK.profile} target="_blank" rel="noopener noreferrer">
                                                                <img
                                                                    src={shopK.profile}
                                                                    alt={shopK.name}
                                                                    className="img-thumbnail"
                                                                    style={{
                                                                        width: "100px",
                                                                        height: "100px",
                                                                    }}
                                                                />
                                                            </a>
                                                        ) : "N/A"}
                                                    </td>
                                                    <td>
                                                        <div className="mb-1">
                                                            <i className="bi bi-envelope-fill me-2 text-primary"></i>
                                                            {shopK.email || "N/A"}
                                                        </div>
                                                        <div className="mb-1">
                                                            <i className="bi bi-telephone-fill me-2 text-success"></i>
                                                            {shopK.contact || "N/A"}
                                                        </div>
                                                        <div>
                                                            <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                                                            {shopK.address || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td>{shopK.request || "N/A"}</td>
                                                    <td>
                                                        <Switch
                                                            checked={shopK.status}
                                                            onChange={() => handleAccountStatus(shopK._id, !shopK.status)}
                                                        />
                                                    </td>
                                                    {/* Action Column */}
                                                    <td className="text-center">

                                                        {
                                                            shopK.request === "pending" ? (
                                                                <>
                                                                    <button
                                                                        className="btn btn-success btn-sm rounded-pill me-2"
                                                                        onClick={() => handleVerify(shopK._id, 'approve')}
                                                                    >
                                                                        <i className="bi bi-check-circle"></i> Confirm
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-danger btn-sm rounded-pill"
                                                                        onClick={() => handleVerify(shopK._id, 'reject')}
                                                                    >
                                                                        <i className="bi bi-x-circle"></i> Reject
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                "-"
                                                            )
                                                        }



                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>


                                </div>
                            </div>

                            {/* Footer */}
                            <div className="card-footer d-flex justify-content-between">
                                <span className="small text-muted">
                                    Showing <b>{shopkeepers.length}</b> shopkeepers
                                </span>
                            </div>
                        </div>
                    )}


                    {/* Wholesellers Table */}
                    {showTable === "wholesellers" && (
                        <div className="card shadow-sm">
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover table-bordered mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Name</th>
                                                <th className="text-center">Profile</th>
                                                <th>Contact Details</th>
                                                <th>Verification</th>
                                                <th>Status</th>
                                                <th className="text-center">Action</th> {/* New column for action */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wholesellers.map((whole, idx) => (
                                                <tr key={whole._id}>
                                                    <td>{idx + 1}</td>
                                                    <td>
                                                        <i className="bi bi-person-circle me-2 text-primary"></i>
                                                        {whole.name || "N/A"}
                                                    </td>

                                                    <td className="text-center">
                                                        {whole.profile ? (
                                                            <a href={whole.profile} target="_blank" >
                                                                <img
                                                                    src={whole.profile}
                                                                    alt={whole.name}
                                                                    className="img-thumbnail"
                                                                    style={{
                                                                        width: "100px",
                                                                        height: "100px",

                                                                    }}
                                                                />
                                                            </a>
                                                        ) : "N/A"}
                                                    </td>
                                                    <td>
                                                        <div className="mb-1">
                                                            <i className="bi bi-envelope-fill me-2 text-primary"></i>
                                                            {whole.email || "N/A"}
                                                        </div>
                                                        <div className="mb-1">
                                                            <i className="bi bi-telephone-fill me-2 text-success"></i>
                                                            {whole.contact || "N/A"}
                                                        </div>
                                                        <div>
                                                            <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                                                            {whole.address || "N/A"}
                                                        </div>
                                                    </td>
                                                    <td>{whole.request || "N/A"}</td>
                                                    <td>
                                                        <Switch
                                                            checked={whole.status}
                                                            onChange={() => handleAccountStatus(whole._id, !whole.status)}
                                                        />
                                                    </td>
                                                    <td className="text-center">

                                                        {
                                                            whole.request === "pending" ? (
                                                                <>
                                                                    <button
                                                                        className="btn btn-success btn-sm rounded-pill me-2"
                                                                        onClick={() => handleVerify(whole._id, 'approve')}
                                                                    >
                                                                        <i className="bi bi-check-circle"></i> Confirm
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-danger btn-sm rounded-pill"
                                                                        onClick={() => handleVerify(whole._id, 'reject')}
                                                                    >
                                                                        <i className="bi bi-x-circle"></i> Reject
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                "-"
                                                            )
                                                        }



                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>
                            </div>

                            {/* Footer */}
                            <div className="card-footer d-flex justify-content-between">
                                <span className="small text-muted">
                                    Showing <b>{wholesellers.length}</b> wholesellers
                                </span>
                            </div>
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}

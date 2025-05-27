import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactModal from "react-modal";
import apiService from "../../services/apiService";
import Switch from "react-switch";

export default function AdminManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {

        allProducts();
    }, []);

    const allProducts = () => {
        setLoading(true);
        apiService.allProducts({})
            .then((res) => {
                if (res.data.success) {
                    setProducts(res.data.data);
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
                        <h2 className="display-4 fw-bold">Manage Products</h2>
                    </div>
                </div>
            </section>

            {/* Category Table */}
            <section className="py-5">
                <div className="container">


                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Product Info</th>
                                            <th>Pricing</th>
                                            <th className="text-center">Image</th>
                                            <th>Description</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.length > 0 ? products.map((product, idx) => (
                                            <tr key={product._id}>
                                                <td className="text-muted">{idx + 1}</td>

                                                <td>
                                                    <div className="fw-semibold">
                                                        <i className="bi bi-box-seam me-1"></i> {product.name || "N/A"}
                                                    </div>
                                                    <div className="text-muted small">
                                                        <i className="bi bi-tags me-1"></i> {product.categoryId?.name || "N/A"}
                                                    </div>
                                                    <div className="text-muted small">
                                                        <i className="bi bi-person me-1"></i> {product.addedById?.name || "N/A"} <br />
                                                        <small>{product.addedById?.email || "N/A"}</small>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div>
                                                        {product.price && product.unit ? (
                                                            <span>₹{product.price} / {product.unit}</span>
                                                        ) : "N/A"}
                                                    </div>
                                                    <div className="text-muted small mt-1">
                                                        {product.stock && product.unit ? (
                                                            <>Available Stock: {product.stock} {product.unit}</>
                                                        ) : "N/A"}
                                                    </div>
                                                </td>


                                                <td className="text-center">
                                                    {product.image ? (
                                                        <a href={product.image} target="_blank" rel="noopener noreferrer">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="img-thumbnail"
                                                                style={{
                                                                    width: "100px",
                                                                    height: "100px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "6px"
                                                                }}
                                                            />
                                                        </a>
                                                    ) : (
                                                        <i className="bi bi-image text-muted" style={{ fontSize: "24px" }}></i>
                                                    )}
                                                </td>

                                                <td style={{ maxWidth: "200px" }}>
                                                    <div className="text-truncate" title={product.description}>
                                                        {product.description || "N/A"}
                                                    </div>
                                                </td>




                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="7" className="text-center">No products found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>


                        </div>

                        <div className="card-footer d-flex justify-content-between">
                            <span className="small text-muted">
                                Showing <b>{products.length}</b> Products
                            </span>
                        </div>
                    </div>
                </div>
            </section>


        </>
    );
}

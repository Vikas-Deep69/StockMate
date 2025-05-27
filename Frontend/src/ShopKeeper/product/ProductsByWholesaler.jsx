import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import './product.css';
import apiService from "../../services/apiService";

export default function ProductsByWholesaler() {

    const parms = useParams();
    const wholesalerId = parms.wholesalerId;
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        allProducts();
    }, []);

    const allProducts = () => {
        setLoading(true);
        apiService.allProducts({ status: true, addedById: wholesalerId })
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

    const toggleSelect = (product) => {
        console.log(selectedProducts);

        const isProductInList = selectedProducts.find((item) => item._id === product._id);
        if (isProductInList) {
            const updatedList = selectedProducts.filter((item) => item._id !== product._id);
            setSelectedProducts(updatedList);
        } else {
            const updatedList = [...selectedProducts, { ...product, quantity: 1 }]; // Add quantity field with default value 1
            setSelectedProducts(updatedList);
        }
    };


    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) return; // Prevent quantity from being less than 1
        const updatedList = selectedProducts.map((prod) =>
            prod._id === id ? { ...prod, quantity: newQuantity } : prod
        );
        setSelectedProducts(updatedList);
    };


    const isSelected = (id) => selectedProducts.some((p) => p._id === id);

    const handleForm = (e) => {
        e.preventDefault();
        setLoading(true);
        let data = {
            "shopkeeperId": sessionStorage.getItem('userId'),
            "products": selectedProducts,
        }
        apiService
            .addRequest(data)
            .then((res) => {
                setLoading(false);
                if (res.data.success == true) {
                    toast.success(res.data.message);
                    navigate("/shop/requests");

                } else {
                    setLoading(false);
                    toast.error(res.data.message);
                }
            })
            .catch((err) => {
                setLoading(false);
                toast.error(err.message);
            });
    };

    return (
        <>
            {/* Banner and Header */}
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

            {/* Product Grid */}
            <section className="pb-5">
                <div className="container-lg">
                    <div className="row mb-3">
                        <div className="col-md-12 d-flex justify-content-between">
                            <h2 className="section-title">Best selling products</h2>
                        </div>
                    </div>

                    <div className="row">
                        {/* Left: Products */}
                        <div className="col-lg-8">
                            <div className="row row-cols-2 row-cols-md-4 g-2">
                                {products.length > 0 ? (
                                    products.map((product) => {
                                        const outOfStock = product.stock === 0;
                                        return (
                                            <div
                                                className={`col ${isSelected(product._id) ? "border border-primary" : ""} ${outOfStock ? "opacity-50" : ""}`}
                                                key={product._id}
                                                onClick={() => !outOfStock && toggleSelect(product)}
                                                style={{ cursor: outOfStock ? "not-allowed" : "pointer" }}
                                            >
                                                <div className="p-2 text-center shadow-sm rounded bg-white h-100 small">
                                                    <img
                                                        src={product.image || "/assets/images/no-image.png"}
                                                        alt={product.name}
                                                        className="img-fluid mb-2"
                                                        style={{ height: "100px", objectFit: "cover" }}
                                                    />
                                                    <h6 className="fw-semibold small mb-1">{product.name || "N/A"}</h6>
                                                    <div className="text-muted">
                                                        ₹{product.price} / {product.unit}
                                                    </div>
                                                    <div className={`text-muted ${product.stock === 0 ? "text-danger" : ""}`}>
                                                        Stock: {product.stock || "0"} {product.unit}
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-12 text-center">No products found</div>
                                )}
                            </div>
                        </div>


                        {/* Right: Selected Products */}
                        <div className="col-lg-4">
                            <div className="bg-white p-4 rounded-3 shadow-sm h-100 border d-flex flex-column">
                                <h5 className="mb-4 fw-semibold text-primary">Selected Products</h5>

                                {selectedProducts.length === 0 ? (
                                    <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5">
                                        <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
                                        <p className="text-muted mb-0">No products selected</p>
                                        <small className="text-muted">Add products from the list</small>
                                    </div>
                                ) : (
                                    <>
                                        <div className="selected-products-list flex-grow-1 overflow-auto mb-3">
                                            {selectedProducts.map((prod) => (
                                                <div
                                                    key={prod._id}
                                                    className="d-flex justify-content-between align-items-center border-bottom py-3"
                                                >
                                                    <div className="flex-grow-1 me-3">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <h6 className="fw-semibold mb-1">{prod.name}</h6>
                                                                <div className="small text-muted">
                                                                    ₹{prod.price} / {prod.unit}
                                                                </div>
                                                            </div>
                                                            <button
                                                                className="btn btn-lg"
                                                                onClick={() => toggleSelect(prod)}

                                                            >
                                                                <i className="bi bi-x"></i>
                                                            </button>
                                                        </div>


                                                        <div className="d-flex align-items-center mt-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary rounded-start-pill"
                                                                onClick={() => updateQuantity(prod._id, Math.max(1, prod.quantity - 1))}
                                                                disabled={prod.quantity <= 1}
                                                            >
                                                                <i className="bi bi-dash"></i>
                                                            </button>
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm border-top-0 border-bottom-0 rounded-0 text-center"
                                                                value={prod.quantity}
                                                                onChange={(e) => {
                                                                    const value = Math.max(1, Number(e.target.value));
                                                                    updateQuantity(prod._id, value);
                                                                }}
                                                                min="1"
                                                                style={{ maxWidth: '60px' }}
                                                            />
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary rounded-end-pill"
                                                                onClick={() => updateQuantity(prod._id, prod.quantity + 1)}
                                                            >
                                                                <i className="bi bi-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            className="btn btn-primary w-100 mt-auto"
                                            onClick={handleForm}
                                        >
                                            Request Now
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}

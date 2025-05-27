import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactModal from "react-modal";
import apiService from "../../services/apiService";
import Switch from "react-switch";

export default function ManageProducts() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState(""); // 'add' or 'update'
    const [_id, setId] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [unit, setUnit] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();



    const customModalStyles = {
        content: {
            width: '50%',
            margin: 'auto',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: 20,
            border: 'none',
            borderRadius: '8px',
            maxHeight: '90vh',
            overflow: 'auto',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
        }
    };



    useEffect(() => {
        fetchCategories();
        allProducts();
    }, []);


    const fetchCategories = () => {
        setLoading(true);
        apiService.allCategories({ status: true })
            .then((res) => {
                if (res.data.success) {
                    setCategories(res.data.data);
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
    const allProducts = () => {
        setLoading(true);
        apiService.allProducts({ addedById: sessionStorage.getItem('userId') })
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



    const openModal = (_id = null) => {
        setModalIsOpen(true);
        if (_id) {
            setFormType("update");
            setId(_id);
            apiService.singleProduct({ _id })
                .then((res) => {
                    if (res.data.success) {
                        setName(res.data.data.name);
                        setImage(res.data.data.image);
                        setCategoryId(res.data.data.categoryId._id);
                        setPrice(res.data.data.price);
                        setStock(res.data.data.stock);
                        setUnit(res.data.data.unit);
                        setDescription(res.data.data.description);
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch((err) => {
                    toast.error(err.message);
                });
        } else {
            setFormType("add");
            setName("");
            setImage("");
            setCategoryId("")
            setPrice("")
            setStock("")
            setUnit("")
            setDescription("")
            setId(null);
        }
    };

    const closeModal = () => {
        setName("");
        setImage("");
        setCategoryId("")
        setPrice("")
        setStock("")
        setUnit("")
        setModalIsOpen(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("unit", unit);
        if (_id) {
            formData.append("_id", _id);
        }
        const apiCall = formType === "update"
            ? apiService.updateProduct(formData)
            : apiService.addProduct(formData);

        apiCall
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    closeModal();
                    allProducts();
                } else {
                    closeModal();
                    toast.error(res.data.message);
                }
                setLoading(false);
            })
            .catch((err) => {
                closeModal();
                toast.error(err.message);
                setLoading(false);
            });
    };

    const productStatus = (_id, status) => {
        setLoading(true);
        apiService.productStatus({ _id, status })
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    fetchCategories();
                    allProducts();
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
                    <div className="mb-3 text-end">
                        <button className="btn btn-sm btn-primary" onClick={() => openModal()}>
                            + Add New Product
                        </button>
                    </div>

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
                                            <th>Status</th>
                                            <th>Edit</th>
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

                                                <td>
                                                    <div title={product.status ? "Active" : "Inactive"}>
                                                        <Switch
                                                            checked={product.status}
                                                            onChange={() => productStatus(product._id, !product.status)}
                                                        />
                                                    </div>
                                                </td>

                                                <td>
                                                    <button className="btn btn-outline-primary btn-sm" onClick={() => openModal(product._id)}>
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
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

            {/* Modal */}
            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Manage Category"
                style={customModalStyles}
            >
                <div className="d-flex justify-content-between mb-3">
                    <h5>{formType === "add" ? "Add New Product" : "Update Category"}</h5>
                    <button className="btn p-0" onClick={closeModal}>
                        <i className="bi bi-x-circle fs-4"></i>
                    </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    {/* Category first */}
                    <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                            className="form-control"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>

                            {categories.map((cat, idx) => (
                                <option value={cat._id}>{cat.name}</option>
                            ))}

                        </select>
                    </div>

                    {/* Product Name */}
                    <div className="mb-3">
                        <label className="form-label">Product Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Product Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>



                    {/* Price */}
                    <div className="mb-3">
                        <label className="form-label">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    {/* Stock */}
                    <div className="mb-3">
                        <label className="form-label">Stock</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Available Stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            required
                        />
                    </div>

                    {/* Unit */}
                    <div className="mb-3">
                        <label className="form-label">Unit</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Eg. kg, liter, piece"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            required
                        />
                    </div>

                    {/* Image */}
                    <div className="mb-3">
                        <label className="form-label">Image</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setImage(e.target.files?.[0])}

                        />
                    </div>
                    {/* Description */}
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter Product Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? "Saving..." : formType === "add" ? "Add Product" : "Update Product"}
                        </button>
                    </div>
                </form>

            </ReactModal>
        </>
    );
}

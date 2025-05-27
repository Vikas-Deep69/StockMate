import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactModal from "react-modal";
import apiService from "../../services/apiService";
import Switch from "react-switch";

export default function ManageCategory() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState(""); // 'add' or 'update'
    const [_id, setId] = useState(null);
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
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
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        apiService.allCategories({})
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

    const openModal = (_id = null) => {
        setModalIsOpen(true);

        if (_id) {
            setFormType("update");
            setId(_id);

            apiService.singleCategory({ _id })
                .then((res) => {
                    if (res.data.success) {
                        setName(res.data.data.name);
                        setImage(res.data.data.image);
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
            setId(null);
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (typeof image !== "string") {
            formData.append("image", image);
        }
        if (_id) {
            formData.append("_id", _id);
        }

        const apiCall = formType === "update"
            ? apiService.updateCategory(formData)
            : apiService.addCategory(formData);

        apiCall
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    closeModal();
                    fetchCategories();
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

    const toggleCategoryStatus = (_id, status) => {
        setLoading(true);

        apiService.changeCategoryStatus({ _id, status })
            .then((res) => {
                if (res.data.success) {
                    toast.success(res.data.message);
                    fetchCategories();
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
                        <h2 className="display-4 fw-bold">Manage Categories</h2>
                    </div>
                </div>
            </section>

            {/* Category Table */}
            <section className="py-5">
                <div className="container">
                    <div className="mb-3 text-end">
                        <button className="btn btn-sm btn-primary" onClick={() => openModal()}>
                            + Add New Category
                        </button>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th className="text-center">Image</th>
                                            <th>Status</th>
                                            <th>Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((cat, idx) => (
                                            <tr key={cat._id}>
                                                <td className="text-muted">{idx + 1}</td>
                                                <td className="fw-semibold">{cat.name || "N/A"}</td>
                                                <td className="text-center">
                                                    {cat.image ? (
                                                        <a href={cat.image} target="_blank">
                                                            <img
                                                                src={cat.image}
                                                                alt={cat.name}
                                                                className="img-thumbnail"
                                                                style={{
                                                                    width: "100px",
                                                                    height: "100px",
                                                                    objectFit: "cover",
                                                                    borderRadius: "8px"
                                                                }}
                                                            />
                                                        </a>
                                                    ) : "N/A"}
                                                </td>

                                                <td>
                                                    <Switch
                                                        checked={cat.status}
                                                        onChange={() => toggleCategoryStatus(cat._id, !cat.status)}
                                                    />
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary btn-sm" onClick={() => openModal(cat._id)}>
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="card-footer d-flex justify-content-between">
                            <span className="small text-muted">
                                Showing <b>{categories.length}</b> categories
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
                    <h5>{formType === "add" ? "Add New Category" : "Update Category"}</h5>
                    <button className="btn p-0" onClick={closeModal}>
                        <i className="bi bi-x-circle fs-4"></i>
                    </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Image</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setImage(e.target.files?.[0])}
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                            {loading ? "Saving..." : formType === "add" ? "Add Category" : "Update Category"}
                        </button>
                    </div>
                </form>
            </ReactModal>
        </>
    );
}

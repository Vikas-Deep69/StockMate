import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiService from "../services/apiService";
export default function ShopkeeperProfile() {

    const override = {
        display: "block",
        margin: "3rem auto",
    };

    const [showProfileForm, setShowProfileForm] = useState(true);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [profile, setProfile] = useState("");
    const [address, setAddress] = useState("");

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        apiService.singleShop({ _id: sessionStorage.getItem('userId') }).then((res) => {
            setTimeout(() => {
                setLoading(false);
            }, 1500);
            if (res.data.success) {
                setName(res.data.data.userId.name);
                setEmail(res.data.data.userId.email);
                setContact(res.data.data.contact);
                setProfile(res.data.data.profile);
                setAddress(res.data.data.address);

            } else {
                setLoading(false);
                toast.error(res.data.message);
            }
        }).catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error(err.message);
        })

    }, []);


    const handleForm = (e) => {
        e.preventDefault();
        setLoading(true);
        let data = new FormData();
        data.append("_id", sessionStorage.getItem('userId'));
        data.append("name", name);
        data.append("email", email);
        data.append("contact", contact);
        data.append("profile", profile);
        data.append("address", address);
        apiService
            .updateWholesaler(data)
            .then((res) => {
                setLoading(false);
                if (res.data.success == true) {
                    toast.success(res.data.message);

                    nav("/whole/profile");

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
    const handlePassword = (e) => {
        e.preventDefault();
        setLoading(true);
        let data = {
            _id: sessionStorage.getItem("userId"),
            oldPassword: password,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        }

        apiService
            .changePassword(data)
            .then((res) => {
                setLoading(false);
                if (res.data.success == true) {
                    toast.success(res.data.message);

                    nav("/whole/profile");
                    setShowProfileForm(true)

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
            <main className="main">
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

                <section id="contact" className="contact section">
                    <div className="container rounded bg-white mt-5 mb-5 p-4 shadow">
                        <div className="d-flex justify-content-between mb-4">

                            <button
                                className={`btn ${showProfileForm ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setShowProfileForm(true)}
                            >
                                Edit Profile
                            </button>


                            <button
                                className={`btn ${!showProfileForm ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setShowProfileForm(false)}
                            >
                                Change Password
                            </button>
                        </div>

                        {showProfileForm ? (
                            <form onSubmit={handleForm}>
                                <div className="row">
                                    <div className="col-md-4 text-center border-end">
                                        <img
                                            className="rounded-circle mt-3"
                                            width="150px"
                                            height={"150px"}
                                            src={
                                                profile || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJkavvBVzIvdiccqhSgnOU96qDtz_Bkc4rLA&s"
                                            }
                                            alt="Profile"
                                        />
                                        <h5 className="mt-3">{name}</h5>
                                        <p className="text-muted">{email}</p>
                                    </div>

                                    <div className="col-md-8">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Mobile Number</label>
                                            <input type="text" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Address</label>
                                            <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Profile Image</label>
                                            <input type="file" className="form-control" onChange={(e) => setProfile(e.target.files?.[0])} />
                                        </div>
                                        <div className="text-center">
                                            <button className="btn btn-primary" type="submit">Save Profile</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handlePassword}>
                                <div className="row">
                                    <div className="col-md-6 offset-md-3">
                                        <h4 className="mb-4 text-center">Change Password</h4>
                                        <div className="mb-3">
                                            <label className="form-label">Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Confirm New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-primary">Update Password</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            </main>
        </>
    )
}
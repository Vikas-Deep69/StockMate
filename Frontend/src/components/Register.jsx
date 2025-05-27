import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import apiService from "../services/apiService";

export default function Register() {
  const override = {
    display: "block",
    margin: "3rem auto",
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [profile, setProfile] = useState("");
  const [userType, setUserType] = useState("wholeSaler");
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleForm = (e) => {
    e.preventDefault();
    setLoading(true);
    let data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    data.append("contact", contact);
    data.append("address", address);
    data.append("profile", profile);
    if (userType == "wholeSaler") {
      apiService
        .wholesalerRegister(data)
        .then((res) => {
          setLoading(false);
          if (res.data.success === true) {
            toast.success(res.data.message);
            nav("/");
            setLoading(false);
          } else {
            setLoading(false);
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        })

    }
    else {
      apiService
        .shopkeeperRegister(data)
        .then((res) => {
          setLoading(false);
          if (res.data.success === true) {
            toast.success(res.data.message);
            setLoading(false);
            nav("/");
          } else {
            setLoading(false);
            toast.error(res.data.message);
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.message);
        })


    }







  };

  return (
    <>
      <main className="main">
        <section id="register-section" className="section py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card shadow-sm border-0">
                  <div className="card-body p-5">
                    {/* Header */}
                    <div className="text-center mb-5">
                      <h2 className="h3 font-weight-bold text-dark mb-1">Create Account</h2>
                      <p className="text-muted">Fill the form to register</p>
                      <div className="divider mx-auto my-4" style={{ width: "80px", borderTop: "2px solid #dee2e6" }}></div>
                    </div>


                    <ul className="nav nav-pills nav-fill mb-4" id="registerTabs" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${userType === "wholeSaler" ? "active" : ""}`}
                          id="wholeSaler-tab"
                          data-bs-toggle="tab"
                          role="tab"
                          aria-controls="wholeSaler"
                          aria-selected={userType === "wholeSaler"}
                          onClick={() => setUserType("wholeSaler")}
                        >
                          <i className="fas fa-warehouse me-2"></i> Wholesaler
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${userType === "shopKeeper" ? "active" : ""}`}
                          id="shopKeeper-tab"
                          data-bs-toggle="tab"
                          role="tab"
                          aria-controls="shopKeeper"
                          aria-selected={userType === "shopKeeper"}
                          onClick={() => setUserType("shopKeeper")}
                        >
                          <i className="fas fa-store me-2"></i> Shop Keeper
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content mt-3" id="registerTabsContent">
                      {/* Whole Seller Tab */}
                      <div
                        className={`tab-pane fade ${userType === "wholeSaler" ? "show active" : ""}`}
                        id="wholeSaler"
                        role="tabpanel"
                        aria-labelledby="wholeSaler-tab"
                      >
                        <form onSubmit={handleForm} method="post">
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Full Name</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <i className="fas fa-user"></i>
                                </span>
                                <input
                                  type="text"
                                  className="form-control ps-3"
                                  placeholder="Enter Full Name"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Contact</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <i className="fas fa-phone"></i>
                                </span>
                                <input
                                  type="tel"
                                  className="form-control ps-3"
                                  placeholder="Enter Contact Number"
                                  required
                                  value={contact}
                                  onChange={(e) => setContact(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>


                          <div className="mb-4">
                            <label className="form-label fw-medium">Profile Image</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">
                                <i className="fas fa-image"></i>
                              </span>
                              <input
                                type="file"
                                className="form-control ps-3"

                                onChange={(e) => setProfile(e.target.files?.[0])}
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="form-label fw-medium">Address</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">
                                <i className="fas fa-map-marker-alt"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control ps-3"
                                placeholder="Enter Address"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Email</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <i className="fas fa-envelope"></i>
                                </span>
                                <input
                                  type="email"
                                  className="form-control ps-3"
                                  placeholder="Enter Email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Password</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <i className="fas fa-lock"></i>
                                </span>
                                <input
                                  type="password"
                                  className="form-control ps-3"
                                  placeholder="Enter Password"
                                  required
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          {loading && <div className="loading">Loading...</div>}

                          <div className="d-grid mt-5">
                            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                              {loading ? "Signing Up..." : "Sign Up As a Wholesaler"}{" "}
                              {!loading && <i className="bi bi-arrow-right ms-2"></i>}
                            </button>
                          </div>

                        </form>
                      </div>

                      {/* Shop Keeper Tab - Similar to Whole Seller but can add different fields if needed */}
                      <div
                        className={`tab-pane fade ${userType === "shopKeeper" ? "show active" : ""}`}
                        id="shopKeeper"
                        role="tabpanel"
                        aria-labelledby="shopKeeper-tab"
                      >
                        <form onSubmit={handleForm} method="post">
                          {/* Same form structure as whole seller */}
                          {/* You can customize fields here if shop keeper needs different fields */}
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Full Name</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <i className="fas fa-user"></i>
                                </span>
                                <input
                                  type="text"
                                  className="form-control ps-3"
                                  placeholder="Enter Full Name"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Contact</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <i className="fas fa-phone"></i>
                                </span>
                                <input
                                  type="tel"
                                  className="form-control ps-3"
                                  placeholder="Enter Contact Number"
                                  required
                                  value={contact}
                                  onChange={(e) => setContact(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>



                          <div className="mb-4">
                            <label className="form-label fw-medium">Profile Image</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">
                                <i className="fas fa-image"></i>
                              </span>
                              <input
                                type="file"
                                className="form-control ps-3"
                                onChange={(e) => setProfile(e.target.files?.[0])}
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="form-label fw-medium">Address</label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">
                                <i className="fas fa-map-marker-alt"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control ps-3"
                                placeholder="Enter Address"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="row g-3 mb-4">
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Email</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <i className="fas fa-envelope"></i>
                                </span>
                                <input
                                  type="email"
                                  className="form-control ps-3"
                                  placeholder="Enter Email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label fw-medium">Password</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                  <i className="fas fa-lock"></i>
                                </span>
                                <input
                                  type="password"
                                  className="form-control ps-3"
                                  placeholder="Enter Password"
                                  required
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                
                            <div className="d-grid mt-5">
                              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                {loading ? "Signing Up..." : "Sign Up As A Shopkeeper"}{" "}
                                {!loading && <i className="bi bi-arrow-right ms-2"></i>}
                              </button>                       
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <p className="mb-0 text-muted">
                        Already have an account?{" "}
                        <Link to={"/"} className="text-primary fw-semibold text-decoration-none">
                          Sign in here
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

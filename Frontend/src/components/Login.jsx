import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiService from "../services/apiService";
import { toast } from "react-toastify";
export default function Login() {

  const override = {
    display: "block",
    margin: "3rem auto",
  };

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const nav = useNavigate()
  const [loading, setLoading] = useState(false);

  const handleForm = (e) => {
    e.preventDefault();
    setLoading(true);
    let data = {
      email: email,
      password: password,
    };
    apiService
      .login(data)
      .then((res) => {
        setLoading(false);
        if (res.data.success == true) {
          if (res.data.data.userType == 1) {
            sessionStorage.setItem("isLogin", "true");
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("name", res.data.data.name);
            sessionStorage.setItem("email", res.data.data.email);
            sessionStorage.setItem("userId", res.data.data._id);
            sessionStorage.setItem("userType", res.data.data.userType);
            toast.success(res.data.message);
            setLoading(false);
            nav("/admin");
          }
          else if (res.data.data.userType == 2) {
            sessionStorage.setItem("isLogin", "true");
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("name", res.data.data.name);
            sessionStorage.setItem("email", res.data.data.email);
            sessionStorage.setItem("userId", res.data.data._id);
            sessionStorage.setItem("userType", res.data.data.userType);
            toast.success(res.data.message);
            setLoading(false);
            nav("/whole");
          }
          else {
            sessionStorage.setItem("isLogin", "true");
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("name", res.data.data.name);
            sessionStorage.setItem("email", res.data.data.email);
            sessionStorage.setItem("userId", res.data.data._id);
            sessionStorage.setItem("userType", res.data.data.userType);
            toast.success(res.data.message);
            setLoading(false);
            nav("/shop");

          }

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
        <section id="login-section" className="section py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="card shadow-sm border-0 rounded-lg overflow-hidden">
                  {/* Card Header */}
                  <div className="card-header bg-white py-4 border-0">
                    <div className="text-center">
                      <h2 className="h4 font-weight-bold text-dark mb-1">
                        Welcome Back
                      </h2>
                      <p className="text-muted mb-0">
                        Enter your credentials to access your account
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body ">
                    <div className="text-center mb-4">
                      <div className="divider mx-auto" style={{
                        width: "80px",
                        height: "3px",
                        backgroundColor: "#0d6efd",
                        borderRadius: "3px"
                      }}></div>
                    </div>

                    <form onSubmit={handleForm} method="post">
                      {/* Email Field */}
                      <div className="mb-4">
                        <label className="form-label fw-medium">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="fas fa-envelope text-muted"></i>
                          </span>
                          <input
                            type="email"
                            className="form-control ps-3 py-3"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="mb-4">
                        <label className="form-label fw-medium">Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="fas fa-lock text-muted"></i>
                          </span>
                          <input
                            type="password"
                            className="form-control ps-3 py-3"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="text-end mt-2">
                          <a href="#forgot-password" className="text-decoration-none small text-muted">
                            Forgot password?
                          </a>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="d-grid mt-5">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                          {loading ? "Signing In..." : "Sign In"}{" "}
                          {!loading && <i className=" ms-2"></i>}
                        </button>
                      </div>

                      {/* Registration Link */}
                      <div className="text-center">
                        <p className="mb-0 text-muted">
                          Don't have an account?{" "}
                          <Link
                            to={"/register"}
                            className="text-primary fw-semibold text-decoration-none"
                          >
                            Create one
                          </Link>
                        </p>
                      </div>
                    </form>
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

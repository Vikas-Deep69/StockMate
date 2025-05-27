import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ShopHeader() {

    let nav = useNavigate();

    const logout = () => {
        sessionStorage.clear();
        toast.success("Logout Successfully");
        setTimeout(() => {
            nav("/");
        }, 500);

    };
    return (
        <>
            <header>
                <div className="container-fluid">
                    <div className="row py-3 border-bottom">
                        <div className="col-sm-3 col-lg-2 text-center text-sm-start d-flex gap-3 justify-content-center justify-content-md-start">
                            <div className="d-flex align-items-center my-3 my-sm-0">
                                <div className="text-primary fw-bold fs-4">
                                    <span>STOCKMATE</span>
                                </div>
                            </div>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasNavbar"
                                aria-controls="offcanvasNavbar"
                            >
                                <svg width={24} height={24} viewBox="0 0 24 24">
                                    <use xlinkHref="#menu" />
                                </svg>
                            </button>
                        </div>

                        <div className="col-sm-9  col-lg-9">
                            <ul className="navbar-nav list-unstyled d-flex flex-row gap-3 gap-lg-5 justify-content-center flex-wrap align-items-center mb-0 fw-bold text-uppercase text-dark">

                                <li className="nav-item active">
                                    <Link to={'/shop'} className="nav-link">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item active">
                                    <Link to={'/shop/wholesalers/view'} className="nav-link">
                                        Wholesalers
                                    </Link>
                                </li>

                                <li className="nav-item active">
                                    <Link to={'/shop/products/view'} className="nav-link">
                                        Products
                                    </Link>
                                </li>
                                <li className="nav-item active">
                                    <Link to={'/shop/requests'} className="nav-link">
                                        Requests
                                    </Link>
                                </li>

                                <li className="nav-item active">
                                    <Link to={'/shop/sales'} className="nav-link">
                                        Purchase
                                    </Link>
                                </li>
                                <li className="nav-item active">
                                    <Link to={'/shop/profile'} className="nav-link">
                                        Profile
                                    </Link>
                                </li>

                                <li className="nav-item active text">
                                    <a onClick={logout} className="nav-link" style={{ cursor: 'pointer' }}>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </header>
        </>


    )
}
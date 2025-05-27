import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../services/apiService";
import { useNavigate } from "react-router-dom";


export default function ShopkeeperRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    apiService.allRequests({ shopkeeperId: sessionStorage.getItem("userId") })
      .then((res) => {
        if (res.data.success) {
          setRequests(res.data.data);
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


  const navigate = useNavigate();


  const paymentHandler = (_id) => {
    setLoading(true);
    const data = { _id };
    apiService
      .pay(data)
      .then((res) => {
        if (res.data.success) {
          const order = res.data.order;
          const options = {
            key: "rzp_test_81m41n13O8OvjC",
            amount: order.amount,
            currency: "INR",
            name: "Acme Corp",
            description: "Test Transaction",
            image: "https://example.com/your_logo",
            order_id: order.id,

            handler: function (response) {
              console.log("✅ Payment Success:", response);
              toast.success("Payment Successful!");
              setLoading(false);
              fetchRequests();
            },
            prefill: {
              name: "Mohit Kumar",
              email: "mohit@gmail.com",
              contact: "1234567890"
            },
            theme: {
              color: "#3399cc"
            }
          };
          const rzp1 = new window.Razorpay(options);
          rzp1.on("payment.failed", function (response) {
            setLoading(false);
            toast.error(response.error.description || "Payment failed");
          });

          rzp1.open();

        } else {
          setLoading(false);
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message || "Something went wrong");
      });
  };


  return (
    <section className="container py-5">
      <h2 className="mb-4">Shopkeeper Requests</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : requests.length > 0 ? (
        <div className="container">
          <div className="row row-cols-1 g-4">
            {requests.map((req, index) => (
              <div key={req._id} className="col">
                <div className="card shadow-sm border-0">
                  {/* Card Header with Wholesaler Info */}
                  <div className="card-header bg-white border-0 pt-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">
                          <i className="bi bi-shop me-2 text-primary"></i>
                          Request to: {req.wholesalerId?.name}
                        </h6>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-light text-dark me-2">
                            <i className="bi bi-file-earmark-text me-1"></i> Request #{index + 1}
                          </span>
                          <span className={`badge ${req.paymentStatus === "pending" ? "bg-warning text-dark" : "bg-success"}`}>
                            <i className={`bi ${req.paymentStatus === "pending" ? "bi-clock" : "bi-check-circle"} me-1`}></i>
                            {req.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <small className="text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(req.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>

                  <div className="card-body pt-2">
                    <div className="row">
                      {/* Products Section */}
                      <div className="col-lg-8">
                        <h6 className="d-flex align-items-center mb-3 text-primary">
                          <i className="bi bi-cart3 me-2"></i>Products Requested
                        </h6>
                        <div className="table-responsive">
                          <table className="table table-sm table-hover table-bordered">
                            <thead>
                              <tr>
                                <th>Product</th>

                                <th className="text-end">Price</th>
                                <th className="text-end">Qty</th>
                                <th className="text-end">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {req.products.map((item, idx) => {
                                const product = item.productId || {};
                                return (
                                  <tr key={idx}>
                                    <td>
                                      <strong>{product.name || "N/A"}</strong>

                                    </td>

                                    <td className="text-end">₹{product.price || "N/A"}</td>
                                    <td className="text-end">{item.quantity} {product.unit || ""}</td>
                                    <td className="text-end fw-bold">₹{(item.quantity * product.price) || "N/A"}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Summary Section */}
                      <div className="col-lg-4 border-start">
                        <div className="d-flex flex-column h-100 ps-3">
                          <h6 className="d-flex align-items-center mb-3 text-primary">
                            <i className="bi bi-info-circle me-2"></i>Request Summary
                          </h6>

                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Payment Method:</span>
                              <span className="fw-bold">
                                <i className={`bi ${req.paymentType === "online" ? "bi-credit-card" : "bi-cash"} me-1`}></i>
                                {req.paymentType}
                              </span>
                            </div>

                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted">Meeting:</span>
                              <span>
                                {req.meetingLink ? (
                                  <a href={req.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                    <i className="bi bi-camera-video me-1"></i>Join
                                  </a>
                                ) : (
                                  <span className="text-muted">Not scheduled</span>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="mt-auto border-top pt-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0">Total:</h5>
                              <h4 className="mb-0 text-success">₹{req.totalAmount}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      <i className="bi bi-hash me-1"></i>ID: {req._id}
                    </div>
                    <div>
                      {req.paymentStatus === "pending" ? (
                        <button className="btn btn-primary px-4" onClick={() => paymentHandler(req._id)} >
                          <i className="bi bi-credit-card me-2"></i>Pay Now
                        </button>
                      ) : (
                        <span className="badge bg-success bg-opacity-10 text-success">
                          <i className="bi bi-check-circle-fill me-1"></i>Paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-receipt me-2"></i>Total of All Requests
                </h5>
                <h4 className="mb-0 text-success">
                  ₹{requests.reduce((sum, r) => sum + (r.totalAmount || 0), 0)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">No requests found.</div>
      )}
    </section>
  );
}


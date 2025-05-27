import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiService from "../services/apiService";
import ReactModal from "react-modal";


export default function WholesalerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [_id, setId] = useState(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
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


  const openModal = (_id) => {
    setId(_id)
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setId(null)
    setModalIsOpen(false);
  };




  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    apiService.allRequests({ wholesalerId: sessionStorage.getItem("userId") })
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


  const handleRequestStatus = (_id, status) => {
    setLoading(true);
    apiService
      .requestStatus({ _id, status })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          toast.success(res.data.message);
          fetchRequests();

        } else {
          toast.error(res.data.message);
          setLoading(false);
          fetchRequests();

        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);

      });
  }


  const handleMeetingForm = () => {

    setLoading(true);
    apiService
      .sendMeetingLink({ _id: _id, meetingLink: meetingLink })
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          toast.success(res.data.message);
          fetchRequests();
          setModalIsOpen(false);

        } else {
          toast.error(res.data.message);
          setLoading(false);
          fetchRequests();
          setModalIsOpen(false);

        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
        setModalIsOpen(false);
      });
  }


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
                <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                  {/* Card Header */}
                  <div className="card-header bg-white border-0 pt-3 pb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="mb-2 text-primary">
                          <i className="bi bi-person-lines-fill me-2"></i>
                          Request from: {req.shopkeeperId?.name || "Unknown Shop"}
                        </h5>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-light text-dark">
                            <i className="bi bi-file-earmark-text me-1"></i> #{index + 1}
                          </span>
                          <span className={`badge ${req.status === 'pending' ? 'bg-warning text-dark' :
                            req.status === 'accepted' ? 'bg-success' : 'bg-danger'}`}>
                            <i className={`bi ${req.status === 'pending' ? 'bi-clock' :
                              req.status === 'accepted' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                            {req.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-muted text-end">
                        <small>
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(req.createdAt).toLocaleDateString()}
                        </small>
                        <div className="small mt-1">
                          <i className="bi bi-hash me-1"></i>{req._id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body pt-2 pb-3">
                    <div className="row">
                      {/* Products Section */}
                      <div className="col-lg-8 pe-lg-4">
                        <div className="mb-4">
                          <h6 className="d-flex align-items-center mb-3 text-primary">
                            <i className="bi bi-cart3 me-2"></i>Products Requested
                          </h6>
                          <div className="table-responsive">
                            <table className="table table-sm table-hover">
                              <thead className="table-light">
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
                                        <div className="text-muted small">{product.category || ""}</div>
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
                      </div>

                      {/* Action Section */}
                      <div className="col-lg-4 ps-lg-4 border-start">
                        <div className="d-flex flex-column h-100">
                          <div>
                            <h6 className="d-flex align-items-center mb-3 text-primary">
                              <i className="bi bi-lightning-charge me-2"></i>Quick Actions
                            </h6>

                            {req.status === 'pending' && (
                              <div className="d-grid gap-2 mb-4">
                                <button
                                  className="btn btn-success py-2"
                                  onClick={() => handleRequestStatus(req._id, 'accepted')}
                                >
                                  <i className="bi bi-check-circle me-2"></i>Accept Request
                                </button>
                                <button
                                  className="btn btn-outline-danger py-2"
                                  onClick={() => handleRequestStatus(req._id, 'rejected')}
                                >
                                  <i className="bi bi-x-circle me-2"></i>Reject Request
                                </button>
                              </div>
                            )}

                            {req.status === 'accepted' && (
                              <div className="mb-4">
                                <h6 className="d-flex align-items-center mb-3">
                                  <i className="bi bi-link-45deg me-2 text-primary"></i>
                                  Meeting Arrangement
                                </h6>

                                {!req.meetingLink ? (
                                  <div className="d-flex flex-column gap-2">
                                    <button
                                      className="btn btn-primary d-flex align-items-center justify-content-center py-2"
                                      onClick={() => openModal(req._id)}
                                    >
                                      <i className="bi bi-plus-circle me-2"></i> Schedule Meeting
                                    </button>
                                    <small className="text-muted text-center">No meeting scheduled</small>
                                  </div>
                                ) : (
                                  <div className="alert alert-info p-3">
                                    <div className="d-flex flex-column gap-2">
                                      <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-medium">
                                          <i className="bi bi-calendar-check me-2"></i>
                                          Scheduled
                                        </span>
                                        <div className="d-flex gap-2">
                                          <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => openModal(req._id)}
                                          >
                                            <i className="bi bi-pencil"></i>
                                          </button>
                                          <a
                                            href={req.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-primary"
                                          >
                                            <i className="bi bi-camera-video me-1"></i> Join
                                          </a>
                                        </div>
                                      </div>
                                      <div className="small text-truncate">
                                        <a href={req.meetingLink} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                          {req.meetingLink}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="mt-auto pt-3 border-top">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="text-muted">Payment:</span>
                              <span className="fw-bold">
                                <i className={`bi ${req.paymentStatus === 'paid' ? 'bi-credit-card text-success' : 'bi-clock text-warning'} me-1`}></i>
                                {req.paymentStatus}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="mb-0">Total:</h5>
                              <h4 className="mb-0 text-success">₹{req.totalAmount}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="card-footer bg-light d-flex justify-content-between align-items-center py-2">
                    <div className="text-muted small">
                      <i className="bi bi-clock me-1"></i>
                      Created: {new Date(req.createdAt).toLocaleString()}
                    </div>
                   
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          <ReactModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Schedule Meeting"
            style={customModalStyles}
            overlayClassName="modal-overlay"
          >
            <div className="modal-content p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <i className="bi bi-link-45deg me-2"></i>
                  Schedule Meeting
                </h5>
                <button className="btn p-0" onClick={closeModal}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <form onSubmit={handleMeetingForm}>
                <div className="mb-4">
                  <label className="form-label">Meeting Link</label>
                  <input
                    type="url"
                    className="form-control py-2"
                    placeholder="https://meet.google.com/abc-xyz"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    required
                  />
                  <small className="text-muted">Paste your Google Meet, Zoom or other meeting link</small>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary py-2" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i> Send Meeting Link
                      </>
                    )}
                  </button>
                  <button type="button" className="btn btn-outline-secondary py-2" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </ReactModal>
        </div>
      ) : (
        <div className="text-center">No requests found.</div>
      )}
    </section>



  );
}


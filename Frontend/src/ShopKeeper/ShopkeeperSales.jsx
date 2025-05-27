import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiService from "../services/apiService";
import { CSVLink } from "react-csv";

export default function ShopkeeperSales() {
    const [categories, setCategories] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [dateRange, setDateRange] = useState([new Date(), new Date()]);
    const [startDate, endDate] = dateRange;
    const [paymentStatus, setPaymentStatus] = useState("");



    useEffect(() => {
        if (startDate && endDate) {
            allSales();
        }
    }, [startDate, endDate, paymentStatus]);


    const allSales = () => {
        let data = {
            startDate: startDate,
            endDate: endDate,
            paymentStatus: paymentStatus,
            shopkeeperId: sessionStorage.getItem('userId')
        };
        setLoading(true);
        apiService.sales(data)
            .then((res) => {
                if (res.data.success) {
                    setCategories(res.data.data);
                    setTotalAmount(res.data.totalAmount);
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

    const csvHeaders = [
        { label: "Sr No", key: "srNo" },
        { label: "Shopkeeper", key: "shopkeeper" },
        { label: "Wholesaler", key: "wholesaler" },
        { label: "Products", key: "products" },
        { label: "Total Amount", key: "amount" },
        { label: "Payment Status", key: "paymentStatus" },
        { label: "Date", key: "date" },
        { label: "Time", key: "time" },
    ];

    const csvData = categories.map((cat, idx) => ({
        srNo: idx + 1,
        shopkeeper: cat.shopkeeperId?.name || "N/A",
        wholesaler: cat.wholesalerId?.name || "N/A",
        products: cat.products
            .map(p => `${p.productId.name} (${p.quantity} ${p.productId.unit}) - ₹${p.productId.price}`)
            .join("; "),
        amount: cat.totalAmount,
        paymentStatus: cat.paymentStatus,
        date: new Date(cat.createdAt).toLocaleDateString('en-GB'),
        time: new Date(cat.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    }));


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
                        <h2 className="display-4 fw-bold">Sales</h2>
                    </div>
                </div>
            </section>

            {/* Category Table */}
            <section className="py-5">

                <div className="container">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Select Date Range</label>
                            <DatePicker
                                selectsRange={true}
                                startDate={dateRange[0]}
                                endDate={dateRange[1]}
                                onChange={(update) => setDateRange(update)}
                                isClearable={true}
                                dateFormat="dd-MM-yyyy"
                                className="form-control"
                                placeholderText="Select date range"
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Payment Status</label>
                            <select
                                className="form-control"
                                value={paymentStatus}
                                onChange={(e) => setPaymentStatus(e.target.value)}
                            >
                                <option value="">Select Payment Status</option>
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div className="col-md-4 mt-4 text-end">
                            <CSVLink
                                data={csvData}
                                headers={csvHeaders}
                                filename={`Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`}
                                className="btn btn-sm btn-primary"
                            >
                                Download CSV
                            </CSVLink>
                        </div>



                    </div>


                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered align-middle text-nowrap">
                                    <thead className="table-light">
                                        <tr className="text-center">
                                            <th scope="col">#</th>
                                            <th scope="col">Products</th>
                                            <th scope="col">Shopkeeper</th>

                                            <th scope="col">Amount</th>
                                            <th scope="col">Payment Status</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((cat, idx) => (
                                            <tr key={cat._id}>
                                                <td className="text-center fw-bold">{idx + 1}</td>


                                                <td>
                                                    {cat.products.map(p => (
                                                        <div key={p._id} className="mb-2 p-2 border rounded bg-light-subtle">
                                                            <div className="fw-semibold text-capitalize">
                                                                {p.productId.name}
                                                            </div>
                                                            <div className="small text-muted">
                                                                Qty: {p.quantity} {p.productId.unit} &nbsp;|&nbsp;
                                                                Price: ₹{(p.productId.price).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </td>

                                                <td>
                                                    {cat.shopkeeperId?.name || <span className="text-muted">N/A</span>} <br />
                                                    <small>{cat.shopkeeperId?.email || <span className="text-muted">N/A</span>}</small>

                                                </td>

                                                <td className="text-end text-success fw-semibold">₹{cat.totalAmount.toLocaleString()}</td>
                                                <td className="text-center">
                                                    <span className={`badge rounded-pill bg-${cat.paymentStatus === 'paid' ? 'success' : 'warning'} text-uppercase`}>
                                                        {cat.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="text-center">{new Date(cat.createdAt).toLocaleDateString('en-GB')}</td>
                                                <td className="text-center">{new Date(cat.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</td>
                                            </tr>
                                            
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div className="card-footer d-flex justify-content-between">
                            <span className="small text-muted">
                                Showing <b>{categories.length}</b> Responses
                            </span>
                            <span className="small text-muted">
                                Total Amount: <b>₹{totalAmount}</b>
                            </span>
                        </div>

                    </div>

                </div>
            </section>


        </>
    );
}

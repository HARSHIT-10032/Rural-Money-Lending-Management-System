import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import API from "../api";
import "./css/SettleLoan.css";

const SettleLoan = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { loans, updateLoan } = useContext(AppContext);
    const [loan, setLoan] = useState(null);
    const [settleOption, setSettleOption] = useState("");
    const [paymentDate, setPaymentDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");

    useEffect(() => {
        const fetchLoan = async () => {
            try {
                // check data in loans array
                let found = (loans || []).find((checkLoan) => checkLoan._id === id);

                // if not found api call
                if (!found) {
                    const { data } = await API.get(`/loans/${id}`);
                    found = data;
                }
                if (found) {
                    setLoan(found);
                }
            } catch (err) {
                console.error("Error fetching loan:", err);
            }
        };

        fetchLoan();
    }, [id, loans]);

    if (!loan){
        return <p>Loan not found or already cleared.</p>;
    } 

    const confirmPayment = async ({ amount, type, method, date }) => {
        try {

            const { data } = await API.post("/loans/payment", {
                loanId: loan._id,
                amount: Number(amount),
                type,
                paymentMethod: method,
                date: new Date(date),
            });

            if (data && data.loan) {
                updateLoan(data.loan);
            }

            alert("Payment recorded");
            navigate("/manage-interest");

        } catch (err) {
            console.error("Payment error:", err.response?.data || err.message);
            alert(`Payment failed: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleConfirmTotal = () => {
        const amt = (loan.amount || 0) + (loan.totalInterest || 0);
        confirmPayment({
            amount: amt,
            type: "Settlement",
            method: paymentMethod,
            date: paymentDate,
        });
    };

    const handleInterestPayment = () => {
        const amt = Number(paymentAmount) || 0;

        if (amt <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        if (amt > loan.totalInterest) {
            alert("Amount cannot exceed outstanding interest");
            return;
        }

        confirmPayment({
            amount: amt,
            type: "Interest",
            method: paymentMethod,
            date: paymentDate,
        });
    };

    return (
        <div className="settle-container">
            <h1>Settle Loan Account</h1>

            {/* Personal Details */}
            <div className="card-box">
                <h2>Personal Details</h2>
                <table className="detail-table">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>
                                {loan.user
                                    ? `${loan.user.name} ${loan.user.middleName || ""} ${loan.user.surname
                                    }`
                                    : "-"}
                            </td>
                        </tr>
                        <tr>
                            <th>Aadhaar</th>
                            <td>{loan.user ? loan.user.aadhaar : "-"}</td>
                        </tr>
                        <tr>
                            <th>Mobile</th>
                            <td>{loan.user ? loan.user.mobile : "-"}</td>
                        </tr>
                        <tr>
                            <th>Village/City</th>
                            <td>{loan.user ? loan.user.village : "-"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Loan Details */}
            <div className="card-box">
                <h2>Loan Details</h2>
                <table className="detail-table">
                    <tbody>
                        <tr>
                            <th>Date of Sanction</th>
                            <td>
                                {loan.sanctionDate
                                    ? new Date(loan.sanctionDate).toISOString().split("T")[0]
                                    : "-"}
                            </td>
                        </tr>
                        <tr>
                            <th>Principal Amount</th>
                            <td>₹{Number(loan.amount || 0).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <th>Interest Rate</th>
                            <td>{loan.interestRate}%</td>
                        </tr>
                        <tr>
                            <th>Total Interest Till Date</th>
                            <td>₹{Number(loan.totalInterest || 0).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <th>Total Interest Paid</th>
                            <td>₹{Number(loan.totalInterestPaid || 0).toLocaleString()}</td>
                        </tr>
                        <tr>
                            <th>Total Outstanding</th>
                            <td>
                                ₹
                                {Number(
                                    (loan.amount || 0) + (loan.totalInterest || 0)
                                ).toLocaleString()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Settle Options */}
            <div className="card-box">
                <h2>Settle Options</h2>
                <div className="settle-card">
                    <div className="settle-type">
                        <label>
                            <input
                                type="radio"
                                name="settleType"
                                value="full"
                                checked={settleOption === "full"}
                                onChange={() => setSettleOption("full")}
                            />
                            Full Settlement
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="settleType"
                                value="interest"
                                checked={settleOption === "interest"}
                                onChange={() => setSettleOption("interest")}
                            />
                            Interest Only
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="settleType"
                                value="compound"
                                checked={settleOption === "compound"}
                                onChange={() => setSettleOption("compound")}
                            />
                            Compound / Continue
                        </label>
                    </div>

                    {settleOption === "full" && (
                        <div className="settle-form">
                            <input
                                type="number"
                                placeholder={(loan.amount || 0) + (loan.totalInterest || 0)}
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                            />
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option>GPay</option>
                                <option>PhonePe</option>
                                <option>Paytm</option>
                                <option>Cash</option>
                                <option>Bank Account</option>
                            </select>
                            <input
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                            />
                            <button className="btn-confirm" onClick={handleConfirmTotal}>
                                Confirm Settlement
                            </button>
                        </div>
                    )}

                    {settleOption === "interest" && (
                        <div className="settle-form">
                            <input
                                type="number"
                                placeholder={loan.totalInterest || 0}
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                max={loan.totalInterest || 0} // ✅ prevent over-typing
                            />

                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option>GPay</option>
                                <option>PhonePe</option>
                                <option>Paytm</option>
                                <option>Cash</option>
                                <option>Bank Account</option>
                            </select>
                            <input
                                type="date"
                                value={paymentDate}
                                onChange={(e) => setPaymentDate(e.target.value)}
                            />
                            <button className="btn-interest" onClick={handleInterestPayment}>
                                Confirm Interest Payment
                            </button>
                        </div>
                    )}

                    {settleOption === "compound" && (
                        <div className="info-box">
                            <p>Principal will be updated for next year interest.</p>
                        </div>
                    )}
                </div>
            </div>

            <button onClick={() => navigate("/manage-interest")} className="btn-back">
                Back to Menu
            </button>
        </div>
    );
};

export default SettleLoan;

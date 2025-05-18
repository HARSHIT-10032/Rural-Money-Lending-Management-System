import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "./css/dashboard.css";

export default function SettledLoanDetail() {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/loans/cleared/${id}`);
        setLoan(data);
      } catch (err) {
        console.error("Loan fetch error:", err);
      }
    })();
  }, [id]);

  if (!loan) return <p className="text-center">Loading loan details...</p>;

  return (
    <div className="page-wrapper">
      <div className="dashboard-container">
        <h2 className="dashboard-title">✅ Cleared Loan</h2>


        <div className="card-box">
          <h3 className="dashboard-subtitle">📑 Settled Loan Details – Personal Info</h3>
          <table className="detail-table">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{loan.user ? `${loan.user.name} ${loan.user.surname}` : "-"}</td>
              </tr>
              <tr>
                <th>Aadhaar</th>
                <td>{loan.user?.aadhaar || "-"}</td>
              </tr>
              <tr>
                <th>Mobile</th>
                <td>{loan.user?.mobile || "-"}</td>
              </tr>
              <tr>
                <th>Village/City</th>
                <td>{loan.user?.village || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card-box">
          <h3 className="dashboard-subtitle">💰 Loan Details</h3>
          <table className="detail-table">
            <tbody>
              <tr>
                <th>Sanction Date</th>
                <td>{loan.sanctionDate?.slice(0, 10) || "-"}</td>
              </tr>
              <tr>
                <th>Closed Date</th>
                <td>{loan.closeDate?.slice(0, 10) || "-"}</td>
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
                <th>Loan Term</th>
                <td>{loan.loanTermMonths} months</td>
              </tr>
              <tr>
                <th>Total Interest Paid</th>
                <td>₹{Number(loan.totalInterestPaid || 0).toLocaleString()}</td>
              </tr>
              <tr>
                <th>Total Amount Paid</th>
                <td>
                  ₹
                  {Number((loan.amount || 0) + (loan.totalInterestPaid || 0)).toLocaleString()}
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{loan.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card-box">
          <h3 className="dashboard-subtitle">📜 Payment History</h3>
          <p> I am working on this feature.</p>
        </div>


        <button onClick={() => navigate("/cleared-loans")} className="btn-back">
          Back to Cleared Loans
        </button>
      </div>
    </div>
  );
}

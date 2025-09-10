import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import "./css/Dashboard.css";

export default function ClearedLoans() {
    const { loans, fetchLoans, loadingLoans } = useContext(AppContext);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // fetch loans on mount
    useEffect(() => {
        if (fetchLoans) fetchLoans();
    }, [fetchLoans]);

    // Filter only cleared loans safely
    const clearedLoans = (loans || []).filter(l => l.status === "Cleared");

    // Apply search filter safely
    const filtered = clearedLoans.filter((loan) => {
        const term = search.toLowerCase();
        return (
            loan.user?.name?.toLowerCase().includes(term) ||
            loan.user?.surname?.toLowerCase().includes(term) ||
            loan.user?.mobile?.toLowerCase().includes(term) ||
            loan.user?.village?.toLowerCase().includes(term) ||
            (loan.sanctionDate && new Date(loan.sanctionDate).toISOString().slice(0, 10).includes(term)) ||
            (loan.closeDate && new Date(loan.closeDate).toISOString().slice(0, 10).includes(term))
        );
    });

    if (loadingLoans) return <p className="text-center">Loading cleared loans...</p>;

    return (
        <div className="page-wrapper">
            <div className="dashboard-container">
                <input
                    type="text"
                    placeholder="Search by Name, Mobile, Village, Date..."
                    className="search-box"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <h2 className="dashboard-title">✅ Cleared Loans</h2>

                <div className="table-container">
                    <table className="loan-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Mobile</th>
                                <th>Village</th>
                                <th>Sanction Date</th>
                                <th>Closed Date</th>
                                <th>Amount</th>
                                <th>Interest Paid</th>
                                <th>Total (P+I)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="no-records">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((loan) => (
                                    <tr key={loan._id}>
                                        <td>{loan.user?.name}</td>
                                        <td>{loan.user?.surname}</td>
                                        <td>{loan.user?.mobile}</td>
                                        <td>{loan.user?.village}</td>
                                        <td>{loan.sanctionDate?.slice(0, 10)}</td>
                                        <td>{loan.closeDate?.slice(0, 10)}</td>
                                        <td>₹{Number(loan.amount || 0).toLocaleString()}</td>
                                        <td>₹{Number(loan.totalInterestPaid || 0).toLocaleString()}</td>
                                        <td>
                                            ₹{Number((loan.amount || 0) + (loan.totalInterestPaid || 0)).toLocaleString()}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn-submit"
                                                onClick={() => navigate(`/cleared-loan-detail/${loan._id}`)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

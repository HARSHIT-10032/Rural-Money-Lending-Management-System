import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ManageInterest.css";
import { AppContext } from "../Context/AppContext";

export default function ManageInterest() {
    const { loans } = useContext(AppContext);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    // Pending loans filter
    const pendingLoans = loans.filter((loan) => loan.status === "Pending");

    // Search filter
    const filteredLoans = pendingLoans.filter((loan) => {
        const term = search.toLowerCase();
        return (
            loan.user?.name?.toLowerCase().includes(term) ||
            loan.user?.surname?.toLowerCase().includes(term) ||
            loan.user?.mobile?.toLowerCase().includes(term) ||
            loan.user?.village?.toLowerCase().includes(term) ||
            (loan.sanctionDate && new Date(loan.sanctionDate).toISOString().slice(0, 10).includes(term))
        );
    });

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

                <h2 className="dashboard-title">📈 Manage Interest</h2>

                <div className="table-container">
                    <table className="loan-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Mobile</th>
                                <th>Village</th>
                                <th>Sanction Date</th>
                                <th>Amount</th>
                                <th>Interest</th>
                                <th>Total (P+I)</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="no-records">No records found</td>
                                </tr>
                            ) : (
                                filteredLoans.map((loan) => (
                                    <tr key={loan._id}>
                                        <td>{loan.user?.name}</td>
                                        <td>{loan.user?.surname}</td>
                                        <td>{loan.user?.mobile}</td>
                                        <td>{loan.user?.village}</td>
                                        <td>{loan.sanctionDate?.slice(0, 10)}</td>
                                        <td>₹{Number(loan.amount || 0).toLocaleString()}</td>
                                        <td>₹{Number(loan.totalInterest || 0).toLocaleString()}</td>
                                        <td className="text-right">
                                            ₹{Number((loan.amount || 0) + (loan.totalInterest || 0)).toLocaleString()}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn-submit"
                                                onClick={() => navigate(`/settle-loan/${loan._id}`)}
                                            >
                                                Settle Loan
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

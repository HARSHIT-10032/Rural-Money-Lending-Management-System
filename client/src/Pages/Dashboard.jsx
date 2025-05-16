import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/dashboard.css";

export default function Dashboard() {
    const [loans, setLoans] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/loans")
            .then((res) => {
                setLoans(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error("Error fetching loans:", err);
            });
    }, []);

    const filteredLoans = loans.filter((loan) => {
        const term = search.toLowerCase();
        return (
            loan.user?.name?.toLowerCase().includes(term) ||
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

                <h2 className="dashboard-title">📊 Dashboard</h2>

                <div className="table-container">
                    <table className="loan-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Mobile</th>
                                <th>Village</th>
                                <th>Sanction Date</th>
                                <th>Amount</th>
                                <th>Interest</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="no-records">
                                        No records found
                                    </td>
                                </tr>
                            ) : (
                                filteredLoans.map((loan) => (
                                    <tr
                                        key={loan._id}
                                    >
                                        <td>{loan.user?.name}</td>
                                        <td>{loan.user?.mobile}</td>
                                        <td>{loan.user?.village}</td>
                                        <td>{loan.sanctionDate?.slice(0, 10)}</td>
                                        <td className="text-right">₹{loan.amount.toLocaleString()}</td>
                                        <td>₹{loan.totalInterest}</td>
                                        <td>₹{loan.amount + loan.totalInterest}</td>


                                        <td className="text-center">
                                            <span
                                                className={`status ${loan.status === "Cleared"
                                                    ? "cleared"
                                                    : loan.status === "Due Soon"
                                                        ? "due"
                                                        : loan.status === "Pending"
                                                            ? "pending"
                                                            : "default"
                                                    }`}
                                            >
                                                {loan.status}
                                            </span>
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

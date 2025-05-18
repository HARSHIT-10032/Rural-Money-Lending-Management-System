import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { AppContext } from "../Context/AppContext";

export default function Navbar() {
  const { setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="navbar-logo">Loan Management</h2>
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/create-loan">Create Loan</Link>
          <Link to="/manage-interest">Manage Interest</Link>
          <Link to="/cleared-loan">Cleared Loan</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
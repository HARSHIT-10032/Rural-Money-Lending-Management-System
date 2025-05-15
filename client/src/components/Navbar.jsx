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
          <Link>Dashboard</Link>
          <Link>Create Loan</Link>
          <Link>Manage Interest</Link>
          <Link>Cleared Loan</Link>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
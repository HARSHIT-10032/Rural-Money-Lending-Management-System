import { useState } from 'react'
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./Context/AppContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import CreateLoan from "./Pages/CreateLoan";
import ManageInterest from "./Pages/ManageInterest";
import SettleLoan from "./Pages/SettleLoan";
import SettledLoanDetail from "./Pages/SettledLoanDetail";
import ClearedLoans from "./Pages/ClearedLoan";

import './App.css'

function App() {
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Navbar setIsLoggedIn={setIsLoggedIn} />
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-loan"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Navbar setIsLoggedIn={setIsLoggedIn} />
            <CreateLoan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-interest"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Navbar setIsLoggedIn={setIsLoggedIn} />
            <ManageInterest />
          </ProtectedRoute>
        }
      />

      <Route
          path="/settle-loan/:id"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Navbar setIsLoggedIn={setIsLoggedIn} />
              <SettleLoan />
            </ProtectedRoute>
          }
      />

      <Route
          path="/cleared-loan"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Navbar setIsLoggedIn={setIsLoggedIn} />
              <ClearedLoans />
            </ProtectedRoute>
          }
      />

      <Route
        path="/cleared-loan-detail/:id"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Navbar setIsLoggedIn={setIsLoggedIn} />
            <SettledLoanDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} />}
      />


      </Routes>
    </Router>
  )
}

export default App

import { useState } from 'react'
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppContext } from "./Context/AppContext";

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



      </Routes>
    </Router>
  )
}

export default App

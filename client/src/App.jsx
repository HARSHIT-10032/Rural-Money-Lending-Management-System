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
      </Routes>
    </Router>
  )
}

export default App

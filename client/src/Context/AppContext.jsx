import { createContext, useEffect, useState } from "react";
import API from "../api";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loadingLoans, setLoadingLoans] = useState(true);

  // Fetch loans from DB
  const fetchLoans = async () => {
    setLoadingLoans(true);
    try {
      const { data } = await API.get("/loans");
      // data assumed to be array of loans with populated user/payments
      setLoans(data);
    } catch (err) {
      console.error("Error fetching loans:", err);
      setLoans([]);
    }
    setLoadingLoans(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLoans();
    } else {
      setLoans([]);
      setLoadingLoans(false);
    }
  }, [isLoggedIn]);

  // helper to add loan locally after create
  const addLoan = (loan) => setLoans((s) => [loan, ...s]);

  // helper to update a loan after payment/revision
  const updateLoan = (updated) =>
    setLoans((s) => s.map((l) => (l._id === updated._id ? updated : l)));

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    user,
    setUser,
    loans,
    setLoans,
    loadingLoans,
    fetchLoans,
    addLoan,
    updateLoan,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

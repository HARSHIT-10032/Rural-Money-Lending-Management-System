import React, { useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import "./css/createloan.css";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function CreateLoanForm() {
    const navigate = useNavigate();
    const { addLoan } = useContext(AppContext);
    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState({
        name: "", middleName: "", surname: "", aadhaar: "", mobile: "",
        village: "", district: "", tehsil: "", state: "",
        sanctionDate: today, amount: "", interestRate: 24, loanTermMonths: 12,
        purpose: "", securityType: "", guarantorName: "", guarantorMobile: "",
        remarks: "", additionalNotes: ""
    });

    const [errors, setErrors] = useState({});
    const [submittedData, setSubmittedData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["aadhaar", "mobile", "guarantorMobile"].includes(name)) {
            if (value === "" || /^[0-9]*$/.test(value)) setForm(f => ({ ...f, [name]: value }));
            return;
        }
        setForm(f => ({ ...f, [name]: value }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required.";
        if (form.aadhaar && form.aadhaar.length !== 12) e.aadhaar = "Aadhaar must be 12 digits.";
        if (!/^[0-9]{10}$/.test(form.mobile)) e.mobile = "Mobile must be 10 digits.";
        if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter valid loan amount.";
        if (!form.interestRate || Number(form.interestRate) <= 0) e.interestRate = "Enter valid interest rate.";
        if (!form.sanctionDate) e.sanctionDate = "Sanction date is required.";
        if (form.guarantorName && !/^[0-9]{10}$/.test(form.guarantorMobile)) {
            e.guarantorMobile = "Enter guarantor mobile (10 digits) or clear guarantor name.";
        }
        if (form.loanTermMonths && (isNaN(Number(form.loanTermMonths)) || Number(form.loanTermMonths) <= 0)) {
            e.loanTermMonths = "Loan term should be positive months.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleReset = () => {
        setForm({
            name: "", middleName: "", surname: "", aadhaar: "", mobile: "",
            village: "", district: "", tehsil: "", state: "",
            sanctionDate: today, amount: "", interestRate: 24, loanTermMonths: 12,
            purpose: "", securityType: "", guarantorName: "", guarantorMobile: "",
            remarks: "", additionalNotes: ""
        });
        setErrors({});
        setSubmittedData(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload = { ...form, amount: Number(form.amount), principalRemaining: Number(form.amount) };
            const res = await API.post("/loans/create", payload);
            const savedLoan = res.data.loan;
            addLoan(savedLoan); // add to context
            setSubmittedData(savedLoan);
            handleReset();
            navigate("/dashboard");
        } catch (err) {
            console.error("Error creating loan:", err);
            alert("Failed to create loan. Check console for details.");
        }
    };

    return (
        <div className="page-container">
            <div className="page-wrapper">
                <div className="loan-form">
                    <h1>Create New Loan</h1>

                    <form onSubmit={handleSubmit}>
                        <section>
                            <h2>Personal Details</h2>
                            <div className="form-grid">
                                {["name","middleName","surname","aadhaar","mobile","village","district","tehsil","state"].map((key) => (
                                    <div key={key} className="form-group">
                                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                        <input type="text" name={key} value={form[key]} onChange={handleChange} />
                                        {errors[key] && <p className="error">{errors[key]}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2>Loan Details</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Sanction Date</label>
                                    <input type="date" name="sanctionDate" value={form.sanctionDate} onChange={handleChange} max={today} />
                                    {errors.sanctionDate && <p className="error">{errors.sanctionDate}</p>}
                                </div>
                                {["amount","interestRate","loanTermMonths"].map(key => (
                                    <div key={key} className="form-group">
                                        <label>{key === "loanTermMonths" ? "Loan Term (months)" : key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                        <input type="number" name={key} value={form[key]} onChange={handleChange} />
                                        {errors[key] && <p className="error">{errors[key]}</p>}
                                    </div>
                                ))}
                                <div className="form-group">
                                    <label>Purpose</label>
                                    <input name="purpose" value={form.purpose} onChange={handleChange} />
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2>Security</h2>
                            <div className="form-group">
                                <label>Security Type</label>
                                <select name="securityType" value={form.securityType} onChange={handleChange}>
                                    {["Trust","Blank Check","Agreement","Registery with Agreement"].map(opt => <option key={opt}>{opt}</option>)}
                                </select>
                            </div>
                        </section>

                        <section>
                            <h2>Guarantor & Misc</h2>
                            <div className="form-grid">
                                {["guarantorName","guarantorMobile","remarks"].map(key => (
                                    <div key={key} className="form-group">
                                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                        <input name={key} value={form[key]} onChange={handleChange} />
                                        {errors[key] && <p className="error">{errors[key]}</p>}
                                    </div>
                                ))}
                                <div className="form-group full-width">
                                    <label>Additional Notes</label>
                                    <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} />
                                </div>
                            </div>
                        </section>

                        <div className="form-actions">
                            <button type="button" onClick={handleReset}>Reset</button>
                            <button type="submit">Save Loan</button>
                        </div>
                    </form>

                    {submittedData && <pre>{JSON.stringify(submittedData, null, 2)}</pre>}
                </div>
            </div>
        </div>
    );
}

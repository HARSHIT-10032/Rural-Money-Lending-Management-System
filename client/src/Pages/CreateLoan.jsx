import React, { useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import "./css/createloan.css";
import API from "../api";

export default function CreateLoanForm() {
    const { loans, addLoan } = useContext(AppContext);
    const today = new Date().toISOString().split("T")[0];

    // form state management
    const [form, setForm] = useState({
        name: "",
        middleName: "",
        surname: "",
        aadhaar: "",
        mobile: "",
        village: "",
        district: "",
        tehsil: "",
        state: "",
        sanctionDate: today,
        amount: "",
        interestRate: 24,
        loanTermMonths: 12,
        purpose: "",
        securityType: "",
        guarantorName: "",
        guarantorMobile: "",
        remarks: "",
        additionalNotes: "",
    });

    // reset the form 
    function handleReset() {
        setForm((s) => ({
            ...s,
            name: "",
            middleName: "",
            surname: "",
            aadhaar: "",
            mobile: "",
            amount: "",
            loanTermMonths: "",
            guarantorMobile: "",
            guarantorName: "",
            purpose: "",
            remarks: "",
            additionalNotes: "",
        }));
        setErrors({});
        setSubmittedData(null);
    }

        function validate() {
        const e = {};
        if (!form.name.trim()){
            e.name = "Name is required.";
        }
        if (form.aadhaar && form.aadhaar.length !== 12){
            e.aadhaar = "Aadhaar must be exactly 12 digits.";
        } 
        if (!/^[0-9]{10}$/.test(form.mobile)){
            e.mobile = "Mobile must be exactly 10 digits.";
        } 
        if (!form.amount || Number(form.amount) <= 0){
            e.amount = "Enter a valid loan amount.";
        } 
        if (!form.interestRate || Number(form.interestRate) <= 0){
             e.interestRate = "Enter valid interest rate.";
        }
        if (!form.sanctionDate){
            e.sanctionDate = "Sanction date is required.";
        } 
        if (form.guarantorName && !/^[0-9]{10}$/.test(form.guarantorMobile)) {
            e.guarantorMobile = "Enter guarantor mobile (10 digits) or clear guarantor name.";
        }
        if (form.loanTermMonths) {
            const term = Number(form.loanTermMonths);
            if (isNaN(term) || term <= 0) {
                e.loanTermMonths = "Loan term should be positive months.";
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    const [errors, setErrors] = useState({});
    const [submittedData, setSubmittedData] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        if (["aadhaar", "mobile", "guarantorMobile"].includes(name)) {
            if (value === "" || /^[0-9]*$/.test(value)) {
                setForm((s) => ({ ...s, [name]: value }));
            }
            return;
        }
        setForm((s) => ({ ...s, [name]: value }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        try {
            const payload = {
                ...form,
                amount: Number(form.amount),
                principalRemaining: form.amount,
            };

            const res = await API.post("/loans/create", payload);

            const savedLoan = res.data.loan;
            addLoan(savedLoan);
            setSubmittedData(savedLoan);
            handleReset();

        } catch (err) {
            console.error("Error creating loan:", err);
            alert("Failed to create loan. Check console for details.");
        }
    };

    return (
        <div className="page-container">
            <div className="page-wrapper">
                <div className="loan-form">
                    <h1 className="form-title">Create New Loan</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Personal Details */}
                        <section>
                            <h2 className="section-title">Personal Details</h2>
                            <div className="form-grid">
                                {[
                                    ["name", "Name", "text"],
                                    ["middleName", "Middle Name", "text"],
                                    ["surname", "Surname", "text"],
                                    ["aadhaar", "Aadhaar No", "text", "12 digits"],
                                    ["mobile", "Mobile No", "text", "10 digits"],
                                    ["village", "Village / City", "text"],
                                    ["district", "District", "text"],
                                    ["tehsil", "Tehsil", "text"],
                                    ["state", "State", "text"],
                                ].map(([key, label, type, placeholder]) => (
                                    <div key={key} className="form-group">
                                        <label>{label}</label>
                                        <input
                                            type={type}
                                            name={key}
                                            value={form[key]}
                                            onChange={handleChange}
                                            placeholder={placeholder}
                                        />
                                        {errors[key] && <p className="error">{errors[key]}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Loan Details */}
                        <section>
                            <h2 className="section-title">Loan Details</h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Date of Sanction</label>
                                    <input
                                        type="date"
                                        name="sanctionDate"
                                        value={form.sanctionDate}
                                        onChange={handleChange}
                                        max={today}
                                    />
                                    {errors.sanctionDate && <p className="error">{errors.sanctionDate}</p>}
                                </div>

                                {[
                                    ["amount", "Amount (₹)", "number"],
                                    ["interestRate", "Interest Rate (%)", "number"],
                                    ["loanTermMonths", "Loan Term (months)", "text"],
                                ].map(([key, label, type]) => (
                                    <div key={key} className="form-group">
                                        <label>{label}</label>
                                        <input type={type} name={key} value={form[key]} onChange={handleChange} />
                                        {errors[key] && <p className="error">{errors[key]}</p>}
                                    </div>
                                ))}

                                <div className="form-group">
                                    <label>Purpose</label>
                                    <input name="purpose" value={form.purpose} onChange={handleChange} placeholder="e.g. Agriculture, Business" />
                                </div>
                            </div>
                        </section>

                        {/* Security */}
                        <section>
                            <h2 className="section-title">Security</h2>
                            <div className="form-group">
                                <label>Security Type</label>
                                <select name="securityType" value={form.securityType} onChange={handleChange}>
                                    <option>Trust</option>
                                    <option>Blank Check</option>
                                    <option>Agreement</option>
                                    <option>Registery with Agreement</option>
                                </select>
                            </div>
                        </section>

                        {/* Guarantor */}
                        <section>
                            <h2 className="section-title">Guarantor (optional) & Misc</h2>
                            <div className="form-grid">
                                {[
                                    ["guarantorName", "Guarantor Name"],
                                    ["guarantorMobile", "Guarantor Mobile"],
                                    ["remarks", "Remarks"],
                                ].map(([key, label]) => (
                                    <div key={key} className="form-group">
                                        <label>{label}</label>
                                        <input name={key} value={form[key]} onChange={handleChange} />
                                        {errors[key] && <p className="error">{errors[key]}</p>}
                                    </div>
                                ))}
                                <div className="form-group full-width">
                                    <label>Additional Notes</label>
                                    <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} placeholder="Optional details for internal use..." />
                                </div>
                            </div>
                        </section>

                        {/* Buttons */}
                        <div className="form-actions">
                            <button type="button" onClick={handleReset} className="btn-reset">Reset</button>
                            <button type="submit" className="btn-submit">Save Loan</button>
                        </div>
                    </form>

                    {submittedData && (
                        <div className="submitted-box">
                            <h3>Submitted Payload (preview)</h3>
                            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

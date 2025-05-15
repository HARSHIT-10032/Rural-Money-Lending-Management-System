import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import { AppContext } from "../Context/AppContext";
import API from "../api";

function Login({ setIsLoggedIn }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);

    const { setUser: setCtxUser, setIsLoggedIn: setCtxLogged } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const { data } = await API.post("/auth/login", { username, password }); // returns token and user

            //save token in local storage
            localStorage.setItem("token", data.token);
            setCtxUser(data.user || null);
            setCtxLogged(true);

            if (setIsLoggedIn) setIsLoggedIn(true);
            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            alert("Login failed — check credentials");
        }
    };

    const handleSignup = async () => {
        //validate
        if (!username || !password || !confirmPassword) {
            return alert("Fill all fields");
        }
        if (password !== confirmPassword) {
            return alert("Passwords do not match");
        }

        try {
            await API.post("/auth/register", { username, password, name: username });
            alert("Signup successful! You can now login.");
            setIsSignup(false);

            //After signup reset fileds
            setUsername("");
            setPassword("");
            setConfirmPassword("");

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="login-page">
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <div>
                <p>Enter Username</p>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <p>Enter Password</p>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />

                {isSignup && (
                    <>
                        <p>Confirm Password</p>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <br />
                    </>
                )}

                <br />
                <button onClick={isSignup ? handleSignup : handleLogin}>
                    {isSignup ? "Sign Up" : "Login"}
                </button>
                <br />
                
                <br />
                <button
                    onClick={() => setIsSignup(!isSignup)}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "blue",
                        cursor: "pointer",
                    }}
                >
                    {isSignup ? "Back to Login" : "Create Account"}
                </button>
            </div>
        </div>
    );
}

export default Login;

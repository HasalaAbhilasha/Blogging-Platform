import React, { useState } from "react";
import '../styles/RegisterPage.css';

export default function RegisterPage() {
    const [username, setUsername] = useState(''); // State for username
    const [password, setPassword] = useState(''); // State for password

    // Function to handle user registration
    async function register(ev) {
        ev.preventDefault(); // Prevent default form submission
        try {
            const response = await fetch(`${import.meta.env.VITE_port}/register`, {
                method: 'POST',
                body: JSON.stringify({ username, password }), // Send username and password
                headers: { 'Content-Type': 'application/json' }, // Set content type to JSON
            });
            if (response.status === 200) {
                alert('Registration successful'); // Alert user on successful registration
            } else {
                alert('Registration failed'); // Alert user on failed registration
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed'); // Alert user on error
        }
    }

    return (
        <div className="form-wrapper">
            <form className="form" onSubmit={register}>
                <p className="form-title">Create an account</p>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={ev => setUsername(ev.target.value)} // Update username state
                    />
                    <span></span>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)} // Update password state
                    />
                </div>
                <button type="submit" className="submit">Register</button>
                <p className="signup-link">
                    Already have an account?
                    <a href="/login">Sign in</a> {/* Link to login page */}
                </p>
            </form>
        </div>
    );
}

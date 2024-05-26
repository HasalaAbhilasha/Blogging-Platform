import React, { useState } from "react";
import '../styles/RegisterPage.css';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev) {
        ev.preventDefault();
        const response = await fetch(`${import.meta.env.VITE_port}/register`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.status === 200) {
            alert('Registration successful');
        } else {
            alert('Registration failed');
        }
    }

    return (
        <form className="form" onSubmit={register}>
            <p className="form-title">Create an account</p>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                />
                <span></span>
            </div>
            <div className="input-container">
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                />
            </div>
            <button type="submit" className="submit">Register</button>
            <p className="signup-link">
                Already have an account?
                <a href="/login">Sign in</a>
            </p>
        </form>
    );
}

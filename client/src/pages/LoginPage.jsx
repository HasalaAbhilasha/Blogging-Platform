import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import '../styles/LoginPage.css';

export default function LoginPage() {
    const [username, setUsername] = useState(''); // State for username input
    const [password, setPassword] = useState(''); // State for password input
    const [redirect, setRedirect] = useState(false); // State for redirection
    const { setUserInfo } = useContext(UserContext); // Context to set user information

    // Handle form submission for login
    async function login(ev) {
        ev.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_port}/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }), // Send username and password as JSON
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo); // Set user information in context
                setRedirect(true); // Set redirection state to true
            });
        } else {
            alert('Wrong credentials');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="form-wrapper">
            <form className="form" onSubmit={login}>
                <p className="form-title">Sign in to your account</p>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={ev => setUsername(ev.target.value)} // Update username state on input change
                    />
                    <span></span>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)} // Update password state on input change
                    />
                </div>
                <button type="submit" className="submit">Sign in</button>
                <p className="signup-link">
                    No account? <a href="/register">Sign up</a>
                </p>
            </form>
        </div>
    );
}

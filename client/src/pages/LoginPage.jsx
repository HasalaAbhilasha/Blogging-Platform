import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import '../styles/LoginPage.css'; // Ensure this CSS file is correctly linked

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUserInfo } = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        } else {
            alert('wrong credentials');
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <form className="form" onSubmit={login}>
            <p className="form-title">Sign in to your account</p>
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
            <button type="submit" className="submit">Sign in</button>
            <p className="signup-link">
                No account?
                <a href="/register">Sign up</a>
            </p>
        </form>
    );
}

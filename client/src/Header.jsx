import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(userInfo => setUserInfo(userInfo))
            .catch(error => console.error('There has been a problem with your fetch operation:', error));
    }, []);

    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return (
        <header className="header">
            <Link to="/" className="logo">Blogging-Platform</Link>
            <nav className="nav">
                {username && (
                    <>
                        <Link to="/create" className="nav-link">Create new post</Link>
                        <a onClick={logout} className="nav-link">Logout ({username})</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

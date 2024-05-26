import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

export default function Header() {
    const { setUserInfo, userInfo } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_port}/profile`, {
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
        fetch(`${import.meta.env.VITE_port}/logout`, {
            credentials: 'include',
            method: 'POST',
        })
            .then(() => {
                setUserInfo(null);
                window.location.reload();
            });
    }

    const username = userInfo?.username;

    return (
        <header className="header">
            <Link to="/" className="logo">Blogging-Platform</Link>
            <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                &#9776;
            </button>
            <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                {username ? (
                    <>
                        <Link to="/create" className="nav-link" onClick={() => setMenuOpen(false)}>Create new post</Link>
                        <a onClick={() => { logout(); setMenuOpen(false); }} className="nav-link">Logout ({username})</a>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
                        <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</Link>
                    </>
                )}
            </nav>
            <div className={`overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}></div>
        </header>
    );
}

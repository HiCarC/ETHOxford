import React from 'react';
import './Dashboard.css';
import backgroundCastle from './../src/images/backgroungCastle.png';
import topLeftLogo from './../src/images/TopLeftLogo.png';
import supporterNearLogo from './../src/images/SupporterNearLogo.png';
import redHeart from './../src/images/RedHeard.png';
import {useNavigate} from "react-router-dom";

function Dashboard() {
    let navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/login');
    };
    const handleRegister = () => {
        navigate('/Register');
    };
    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <img src={topLeftLogo} alt="Logo" className="dashboard-logo" />
                <nav className="dashboard-nav">
                    <a href="/about">About</a>
                    <a href="/support">Support</a>
                    <a href="/faq">FAQ</a>
                    <button className="dashboard-register-btn" onClick={handleRegister}>Register</button>
                </nav>
            </header>
            <main className="dashboard-main">
                <img src={backgroundCastle} alt="Castle" className="dashboard-background" />
                <div className="dashboard-content">
                    <h1 className="dashboard-title">DeDoctor</h1>
                    <p className="dashboard-subtitle">Accessible Data-Driven Healthcare Solutions</p>
                    <button className="dashboard-signin-btn" onClick={handleSignIn}>Sign in</button>
                </div>
            </main>
            <footer className="dashboard-footer">
                <span className="dashboard-made-with">Made with <img src={redHeart} alt="Heart" /> at Oxford</span>
                <span className="dashboard-supported-by">Supported by <img src={supporterNearLogo} alt="Near Logo" /></span>
            </footer>
        </div>
    );
}

export default Dashboard;

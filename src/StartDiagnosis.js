import React from 'react';
import './StartDiagnosis.css';
import topLeftLogo from './../src/images/TopLeftLogo.png';
import redHeart from './../src/images/RedHeard.png';
import supporterNearLogo from './../src/images/SupporterNearLogo.png';

function StartDiagnosis() {
    return (
        <div className="start-diagnosis">
            <header className="start-diagnosis-header">
                <img src={topLeftLogo} alt="Logo" className="start-diagnosis-logo" />
                <nav className="start-diagnosis-nav">
                    <a href="/about">About</a>
                    <a href="/support">Support</a>
                    <a href="/faq">FAQ</a>
                    <a href="/sign-out" className="sign-out-btn">Sign Out</a>
                </nav>
            </header>
            <main className="start-diagnosis-main">
                <h1 className="start-diagnosis-title">DeDoctor</h1>
                <button className="start-diagnosis-button">Start diagnosis</button>
            </main>
            <footer className="start-diagnosis-footer">
                <span className="start-diagnosis-made-with">Made with <img src={redHeart} alt="Heart" /> at Oxford</span>
                <span className="start-diagnosis-supported-by">Supported by <img src={supporterNearLogo} alt="Near Logo" /></span>
            </footer>
        </div>
    );
}

export default StartDiagnosis;

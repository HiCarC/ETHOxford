import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Diagnosis1.css';
import topLeftLogo from './../src/images/TopLeftLogo.png';
import redHeart from './../src/images/RedHeard.png';
import supporterNearLogo from './../src/images/SupporterNearLogo.png';

function Diagnosis() {
    let navigate = useNavigate();
    const [bmi, setBmi] = useState(0);
    const [physicalHealth, setPhysicalHealth] = useState(1);
    const [mentalHealth, setMentalHealth] = useState(1);
    const [generalHealth, setGeneralHealth] = useState(1);
    const [sleepTime, setSleepTime] = useState(1);

    const handleBack = () => {
        navigate(-1); // This will take you back to the last route
    };

    const handleNext = () => {
        navigate('/Diagnosis2'); // Change to your actual next page route
    };

    return (
        <div className="diagnosis">
            <header className="diagnosis-header">
                <img src={topLeftLogo} alt="Logo" className="diagnosis-logo" />
                <nav className="diagnosis-nav">
                    <a href="/about">About</a>
                    <a href="/support">Support</a>
                    <a href="/faq">FAQ</a>
                    <a href="/" className="sign-out-btn">Sign Out</a>
                </nav>
            </header>
            <main className="diagnosis-main">
                <h1 className="diagnosis-title">DeDoctor</h1>
                <div className="diagnosis-progress">
                    {/* Add progress indicator here */}
                </div>
                <div className="diagnosis-content">
                    <h2 className="diagnosis-subtitle">Health-status: overview</h2>
                    <div className="range-container">
                        <label htmlFor="bmi">BMI: {bmi}</label>
                        <input type="range" id="bmi" name="bmi" min="0" max="100" value={bmi}
                               onChange={(e) => setBmi(e.target.value)}/>
                    </div>
                    <div className="range-container">
                        <label htmlFor="mentalHealth">Mental health: {mentalHealth}</label>
                        <input type="range" id="mentalHealth" name="mentalHealth" min="1" max="10" value={mentalHealth}
                               onChange={(e) => setMentalHealth(e.target.value)}/>
                    </div>
                    <div className="range-container">
                        <label htmlFor="generalHealth">General health: {generalHealth}</label>
                        <input type="range" id="generalHealth" name="generalHealth" min="1" max="10" value={generalHealth}
                               onChange={(e) => setGeneralHealth(e.target.value)}/>
                    </div>
                    <div className="range-container">
                        <label htmlFor="sleepTime">Sleep time : {sleepTime}</label>
                        <input type="range" id="sleepTime" name="sleepTime" min="1" max="10" value={sleepTime}
                               onChange={(e) => setSleepTime(e.target.value)}/>
                    </div>
                </div>
                <div className="diagnosis-buttons">
                    <button onClick={handleBack} className="back-button">Back</button>
                    <button onClick={handleNext} className="next-button">Next</button>
                </div>
            </main>
            <footer className="diagnosis-footer">
                <span className="diagnosis-made-with">Made with <img src={redHeart} alt="Heart" /> at Oxford</span>
                <span className="diagnosis-supported-by">Supported by <img src={supporterNearLogo} alt="Near Logo" /></span>
            </footer>
        </div>
    );
}

export default Diagnosis;

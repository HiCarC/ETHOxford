import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Diagnosis2.css';
import topLeftLogo from './../src/images/TopLeftLogo.png';
import redHeart from './../src/images/RedHeard.png';
import supporterNearLogo from './../src/images/SupporterNearLogo.png';

const healthQuestions = [
    'Smoking',
    'Strokes',
    'Difficulty Walking',
    'Diabetic',
    'Physical disability',
    'Skin Cancer',
    'Asthma',
    'KidneyDisease'
];

function Diagnosis2() {
    let navigate = useNavigate();
    const [answers, setAnswers] = useState(healthQuestions.reduce((acc, question) => {
        acc[question] = null; // Initialize all answers as null
        return acc;
    }, {}));

    const handleBack = () => {
        navigate(-1);
    };

    const handleNext = () => {
        navigate('/Diagnosis3'); // Update with the correct route for the next step
        console.log(answers); // Here you would typically send this data to your backend
    };

    const handleToggle = (question, value) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [question]: value
        }));
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
                {/* Content */}
                <form className="health-questions">
                    {healthQuestions.map((question, index) => (
                        <div key={index} className="health-question">
                            <span>{question}</span>
                            <div className="toggle-switches">
                                <button
                                    type="button"
                                    className={`toggle-button ${answers[question] === true ? 'active' : ''}`}
                                    onClick={() => handleToggle(question, true)}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className={`toggle-button ${answers[question] === false ? 'active' : ''}`}
                                    onClick={() => handleToggle(question, false)}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    ))}
                </form>
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

export default Diagnosis2;

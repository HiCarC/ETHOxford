import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Diagnosis4.css'; // You need to create this CSS file and style according to your design
import topLeftLogo from './../src/images/TopLeftLogo.png';
import redHeart from './../src/images/RedHeard.png';
import supporterNearLogo from './../src/images/SupporterNearLogo.png';

function Diagnosis4() {
    let navigate = useNavigate();
    const [diagnosisOutput, setDiagnosisOutput] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [question, setQuestion] = useState('');

    useEffect(() => {
        // Fetch the diagnosis result from an API
        fetchDiagnosisOutput();
        // Fetch the recommendations from an API
        fetchRecommendations();
    }, []);

    const fetchDiagnosisOutput = async () => {
        // Placeholder for API call
        const output = 'Diagnosis result from the Federated learning shows that: You are in a good shape :) ';
        setDiagnosisOutput(output);
    };

    const fetchRecommendations = async () => {
        // Placeholder for API call
        const recommendationsResult = 'The recommendations from the model is that: you should maintain this form.';
        setRecommendations(recommendationsResult);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // You would typically send the question to an API here and then set the response
    };

    const handleFinish = () => {
        navigate( '/'); // Update with the correct route for the finish step
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
                    {/* Progress indicator */}
                </div>
                <div className="diagnosis-output">
                    <h2>Diagnosis</h2>
                    <textarea readOnly value={diagnosisOutput} />
                </div>
                <div className="diagnosis-recommendations">
                    <h2>Recommendations</h2>
                    <textarea readOnly value={recommendations} />
                </div>
                <div className="de-doctor-llm">
                    <form onSubmit={handleSubmit}>
                        <button type="submit">Send to your doctor </button>
                    </form>
                </div>
                <button onClick={handleFinish} className="finish-button">Finish</button>
            </main>
            <footer className="diagnosis-footer">
                <span className="diagnosis-made-with">Made with <img src={redHeart} alt="Heart" /> at Oxford</span>
                <span className="diagnosis-supported-by">Supported by <img src={supporterNearLogo} alt="Near Logo" /></span>
            </footer>
        </div>
    );
}

export default Diagnosis4;

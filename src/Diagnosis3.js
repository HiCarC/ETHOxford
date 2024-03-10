import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Diagnosis3.css'; // You might need to create this CSS file and style according to your design
import topLeftLogo from './../src/images/TopLeftLogo.png';
import redHeart from './../src/images/RedHeard.png';
import supporterNearLogo from './../src/images/SupporterNearLogo.png';

function Diagnosis3() {
    let navigate = useNavigate();
    const [sex, setSex] = useState('');
    const [ethnicity, setEthnicity] = useState('');
    const [age, setAge] = useState('');

    const handleBack = () => {
        navigate(-1);
    };

    const handleNext = () => {
        navigate('/Diagnosis4'); // Update with the correct route for the next step
        // Here you would typically handle form submission, e.g., sending data to your backend
        console.log({ sex, ethnicity, age });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleNext();
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
                <form className="diagnosis-content" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h2 className="form-subtitle">Demographic information</h2>
                        <div className="form-group">
                            <label>Sex</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="Male"
                                        checked={sex === 'Male'}
                                        onChange={(e) => setSex(e.target.value)}
                                    /> Male
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="sex"
                                        value="Female"
                                        checked={sex === 'Female'}
                                        onChange={(e) => setSex(e.target.value)}
                                    /> Female
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Ethnicity</label>
                            <div className="radio-group">
                                {/* List all ethnicity options */}
                                <label>
                                    <input
                                        type="radio"
                                        name="ethnicity"
                                        value="White"
                                        checked={ethnicity === 'White'}
                                        onChange={(e) => setEthnicity(e.target.value)}
                                    /> White
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="ethnicity"
                                        value="Black"
                                        checked={ethnicity === 'Black'}
                                        onChange={(e) => setEthnicity(e.target.value)}
                                    /> Black
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="ethnicity"
                                        value="Native"
                                        checked={ethnicity === 'Native'}
                                        onChange={(e) => setEthnicity(e.target.value)}
                                    /> Native
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="ethnicity"
                                        value="Asiatic"
                                        checked={ethnicity === 'Asiatic'}
                                        onChange={(e) => setEthnicity(e.target.value)}
                                    /> Asiatic
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="ethnicity"
                                        value="Hispanic"
                                        checked={ethnicity === 'Hispanic'}
                                        onChange={(e) => setEthnicity(e.target.value)}
                                    /> Hispanic
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                name="age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="form-navigation">
                        <button type="button" onClick={handleBack} className="back-button">Back</button>
                        <button type="submit" className="next-button">Next</button>
                    </div>
                </form>
            </main>
            <footer className="diagnosis-footer">
                <span className="diagnosis-made-with">Made with <img src={redHeart} alt="Heart" /> at Oxford</span>
                <span className="diagnosis-supported-by">Supported by <img src={supporterNearLogo} alt="Near Logo" /></span>
            </footer>
        </div>
    );
}

export default Diagnosis3;

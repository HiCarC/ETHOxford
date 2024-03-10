import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import RegisterPatient from "./RegisterPatient";
import CompleteRegistration from './CompleteRegistration';
import Dashboard from './Dashboard';
import StartDiagnosis from "./StartDiagnosis";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<RegisterPatient />} />
                    <Route path="/complete-registration" element={<CompleteRegistration />} />
                    <Route path="/Dashboard" element={<Dashboard />} /> {/* Add Dashboard route */}
                    <Route path="/StartDiagnosis" element={<StartDiagnosis />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

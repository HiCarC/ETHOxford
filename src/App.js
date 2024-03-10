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
import Diagnosis1 from "./Diagnosis1";
import DownloadKey from "./DownloadKey";
import Diagnosis2 from "./Diagnosis2";
import Diagnosis3 from "./Diagnosis3";
import Diagnosis4 from "./Diagnosis4";
import Login from "./Login";
import ProtectedRoute from './ProtectedRoute'; // Make sure this is correctly imported

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPatient />} />
                    <Route path="/download-key" element={<DownloadKey />} />
                    <Route path="/complete-registration" element={<CompleteRegistration />} />
                    <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
                        <Route path="/StartDiagnosis" element={<StartDiagnosis />} />
                        <Route path="/Diagnosis1" element={<Diagnosis1 />} />
                        <Route path="/Diagnosis2" element={<Diagnosis2 />} />
                        <Route path="/Diagnosis3" element={<Diagnosis3 />} />
                        <Route path="/Diagnosis4" element={<Diagnosis4 />} />
                    </Route>
                    <Route path="/check-email" element={<div>Check your email for the key</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

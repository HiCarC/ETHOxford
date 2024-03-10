import React from 'react';
import {
    BrowserRouter as Router,
    Routes, // Use Routes instead of Switch
    Route,
} from 'react-router-dom';
import RegisterPatient  from "./RegisterPatient";
import CompleteRegistration from './CompleteRegistration';
import NearAuth from "./nearauth";

function App() {
    return (
        <Router>
            <div>
                <Routes> {/* Updated to Routes */}
                    <Route path="/" element={<RegisterPatient />} />
                    <Route path="/complete-registration" element={<CompleteRegistration />} />
                    <Route path="/nearauth" element={<NearAuth />} />
                    {/* Update your other routes similarly */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

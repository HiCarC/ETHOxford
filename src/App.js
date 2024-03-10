import React from 'react';
import {
    BrowserRouter as Router,
    Routes, // Use Routes instead of Switch
    Route,
} from 'react-router-dom';
import CompleteRegistration from './CompleteRegistration';

function App() {
    return (
        <Router>
            <div>
                <Routes> {/* Updated to Routes */}
                    <Route path="/" element={<CompleteRegistration />} />
                    <Route path="/complete-registration" element={<CompleteRegistration />} />
                    {/* Update your other routes similarly */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;

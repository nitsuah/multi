
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './Lobby';
import Home from './Home';
import Solo from './Solo';

const NotFound = () => (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
    </div>
);

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/play' element={<Lobby />} />
                <Route path='/solo' element={<Solo />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;

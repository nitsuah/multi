import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Lobby from './Lobby';
import Home from './Home';

const App = () => {

return (
    <Router>
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/play' element={<Lobby/>} />
    </Routes>
    </Router>
    );
};

export default App;

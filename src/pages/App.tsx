import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Lobby from './Lobby';
import Home from './Home';
import Solo from './Solo';

const App = () => {

return (
    <Router>
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/play' element={<Lobby/>} />
        <Route path='/solo' element={<Solo/>} />
    </Routes>
    </Router>
    );
};

export default App;

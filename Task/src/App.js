import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomeScene/Home';
import Search from './SearchScene/Search';
import Intro from './IntroScene/CategorySelect.js';
import Login from './components/RegisterForm.js';

function App() {
  return (
    <Router>
      <div>
        <hr />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/intro" element={<Intro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


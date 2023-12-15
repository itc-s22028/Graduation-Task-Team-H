import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomeScene/Home';
import Search from './SearchScene/Search';
import Intro from './IntroScene/CategorySelect.js';
import IntroQuestion from './IntroScene/IntroQuestion.js';
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
          <Route path="/categoryselect" element={<Intro />} />
          <Route path="/intro-question" element={<IntroQuestion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


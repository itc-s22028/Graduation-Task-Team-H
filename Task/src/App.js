import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './HomeScene/Home';
import Search from './SearchScene/Search';
import Intro from './IntroScene/Intro';

function App() {
  return (
    <Router>
      <div>
        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Search" element={<Search />} />
          <Route path='/Intro' element={<Intro />} />
        </Routes>
        
        
        

      </div>
    </Router>
  );
}

export default App;

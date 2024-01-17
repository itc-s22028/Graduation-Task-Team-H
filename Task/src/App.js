<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./HomeScene/Home";
import Search from "./SearchScene/Search";
import Login from "./components/RegisterForm.js";
import Command from "./Command/Command.js";
import NakasoneRoom from "./Command/NakasoneRoom.js";
import Intro from "./IntroScene/CategorySelect.js";
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomeScene/Home';
import Search from './SearchScene/Search';
import Login from './components/RegisterForm.js';
import Command from './Command/Command.js';

import CategorySelect from './IntroScene/CategorySelect.js';
import IntroDon from './IntroScene/IntroDon.js';

import NakasoneRoom from './Command/NakasoneRoom.js';
import Panda from './components/Panda.js';


>>>>>>> 0751b95e1aa6b116a3bc5ea3b2aa72fcfc3c8321

function App() {
  return (
    <Router>
      <div>
        <hr />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
<<<<<<< HEAD
          <Route path="/categoryselect" element={<Intro />} />
=======
          <Route path="/panda" element={<Panda />} />


          {/* <Route path="/categoryselect" element={<Intro />} /> */}
          {/* <Route path="/intro-question" element={<IntroQuestion />} /> */}

>>>>>>> 0751b95e1aa6b116a3bc5ea3b2aa72fcfc3c8321
          <Route path="/Command" element={<Command />} />
          <Route path="/NakasoneRoom" element={<NakasoneRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

<<<<<<< HEAD
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomeScene/Home';
import Search from './SearchScene/Search';
import Login from './components/RegisterForm.js';
import Command from './Command/Command.js';

import CategorySelect from './IntroScene/CategorySelect.js';
import IntroDon from './IntroScene/IntroDon.js';

import NakasoneRoom from './Command/NakasoneRoom.js';


=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./HomeScene/Home";
import Search from "./SearchScene/Search";
import Login from "./components/RegisterForm.js";
import Command from "./Command/Command.js";
import NakasoneRoom from "./Command/NakasoneRoom.js";
>>>>>>> c8429f5dc666e434f4414b3ed588009c118f26ba

function App() {
  return (
    <Router>
      <div>
        <hr />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />

          {/* <Route path="/categoryselect" element={<Intro />} /> */}
          {/* <Route path="/intro-question" element={<IntroQuestion />} /> */}

          <Route path="/Command" element={<Command />} />
          <Route path="/NakasoneRoom" element={<NakasoneRoom />} />
          <Route path="/CategorySelect" element={<CategorySelect />} />
          <Route path="/IntroDon" element={<IntroDon />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;

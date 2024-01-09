import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./HomeScene/Home";
import Search from "./SearchScene/Search";
import Login from "./components/RegisterForm.js";
import Command from "./Command/Command.js";
import NakasoneRoom from "./Command/NakasoneRoom.js";
import Intro from "./IntroScene/CategorySelect.js";

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
          <Route path="/Command" element={<Command />} />
          <Route path="/NakasoneRoom" element={<NakasoneRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

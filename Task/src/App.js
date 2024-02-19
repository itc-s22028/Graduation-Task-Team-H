import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LikeProvider } from "../src/components/LikeContext.js";
import Home from "./HomeScene/Home";
import Search from "./SearchScene/Search";
// import Login from "./components/RegisterForm.js";
import Command from "./Command/Command.js";
import CategorySelect from "./IntroScene/CategorySelect.js";
import IntroDon from "./IntroScene/IntroDon.js";
import NakasoneRoom from "./Command/NakasoneRoom.js";
import Panda from "./components/Panda.js";
import Intro from "./IntroScene/Ranking.js";
import LyricSearch from "./components/LyricSearch.js";

function App() {
  return (
    <Router>
      <div>
        <LikeProvider>
          <hr />

          <Routes>
            <Route path="/" element={<Panda />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/ranking" element={<Intro />} />
            <Route path="/panda" element={<Panda />} />

            <Route path="/Command" element={<Command />} />
            <Route path="/NakasoneRoom" element={<NakasoneRoom />} />
            <Route path="/CategorySelect" element={<CategorySelect />} />
            <Route path="/IntroDon" element={<IntroDon />} />
            <Route path="/Lyric" element={<LyricSearch />} />
          </Routes>
        </LikeProvider>
      </div>
    </Router>
  );
}

export default App;

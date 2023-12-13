import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './HomeScene/Home';
import Search from './SearchScene/Search';
import CategorySelect from './IntroScene/CategorySelect';

function App() {
  return (
    <Router>
      <div>
        <hr />

        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Search" element={<Search />} />
          <Route path='/CategorySelect' element={<CategorySelect />} />

          <Route path="/Search" element={<Search />} />
        </Routes>
        
        
        

      </div>
    </Router>
  );
}

export default App;

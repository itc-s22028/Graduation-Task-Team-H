// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Home from './HomeScene/Home';
// import Search from './SearchScene/Search';
// import Intro from './IntroScene/Intro';
// import Login from './components/RegisterForm.js'


// function App() {
//   return (
//     <Router>
//       <div>
//         <hr />

//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/Search" element={<Search />} />
//           <Route path='/Intro' element={<Intro />} />
//         </Routes>
        
        
        

//       </div>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomeScene/Home';
import Search from './SearchScene/Search';

import CategorySelect from './IntroScene/CategorySelect';
import Intro from './IntroScene/Intro';
import Login from './components/RegisterForm.js';


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


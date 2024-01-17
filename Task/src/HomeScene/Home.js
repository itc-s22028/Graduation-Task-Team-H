// // Home.js

// import React, { useState, useEffect } from 'react';
// import './HomeStyle.css';
// import HomeLogo from '../images/HomeLogo.png';
// import BackgroundImage1 from '../images/HidaYagi.png'; // 画像のパスを正しく指定
// import BackgroundImage2 from '../images/hikanoko.jpg';
// import KuchikomiPic from '../images/KuchikomiPic.png';
// import SelectPic from '../images/SelectPic.png';

// function Home() {
//   const [logoClickCount, setLogoClickCount] = useState(0);
//   const maxClickCount = 3;
//   const [textAnimation, setTextAnimation] = useState('scatter');

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       // Toggle between 'scatter' and 'bounce'
//       setTextAnimation((prevAnimation) =>
//         prevAnimation === 'scatter' ? 'bounce' : 'scatter'
//       );
//     }, 3000);

//     // Cleanup the interval to avoid memory leaks
//     return () => clearInterval(intervalId);
//   }, []); // Empty dependency array ensures this effect runs only once

//   const handleLogoClick = () => {
//     setLogoClickCount((prevCount) => prevCount + 1);
//   };

//   const getBackgroundImage = () => {
//     // クリック数に応じて適切な背景画像のパスを返す
//     return logoClickCount < maxClickCount ? BackgroundImage1 : BackgroundImage2;
//   };

//   const bodyStyle = {
//     backgroundImage: `url(${getBackgroundImage()})`,
//     backgroundPosition: 'center',
//     backgroundRepeat: 'repeat',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//     backgroundBlendMode: 'lighten',
//     height: '100vh',
//     position: 'relative',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundSize: '100px',
//     overflow: 'hidden',
//     animation: 'moveBackground 10s linear infinite',
//   };

//   const contentStyle = {
//     display: logoClickCount >= maxClickCount ? 'none' : 'block',
//   };

//   const replacementContentStyle = {
//     display: logoClickCount >= maxClickCount ? 'block' : 'none',
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//   };

//   return (
//     <div style={bodyStyle}>
//       {logoClickCount < maxClickCount ? (
//         <div style={contentStyle}>
//           <img
//             src={HomeLogo}
//             alt=""
//             className="HomeLogo"
//             onClick={handleLogoClick}
//             style={{ cursor: 'pointer' }}
//           />
//           <button
//             className="goHome"
//             onClick={() => (window.location.href = '/')}>
//               ログインへ
//           </button>
//           <div className="Hometitle">
//             <h3>口コミ検索かイントロドンを選ぶ</h3>
//           </div>
//           <div className="AllContent">
//             <div className="SearchCon">
//               <img src={KuchikomiPic} alt="" className="KuchikomiPic" />
//               <button
//                 className="NextSearchBt"
//                 onClick={() => (window.location.href = '/Search')}
//               >
//                 口コミ検索へ
//               </button>
//             </div>
//             <div className="IntroCon">
//               <img src={SelectPic} alt="" className="SelectPic" />
//               <button
//                 className="IntroBt"
//                 onClick={() => (window.location.href = '/CategorySelect')}
//               >
//                 イントロドン
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : null}

//       {logoClickCount >= maxClickCount && (
//         <div style={replacementContentStyle}>
//           {/* 3回クリックされたら表示される新しいコンテンツ */}
//           <button
//             className={`Command ${textAnimation}`}
//             onClick={() => (window.location.href = '/Command')}
//           >
//             ？？？
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Home;

// Home.js

import React, { useState, useEffect } from "react";
import "./HomeStyle.css";
import HomeLogo from "../images/HomeLogo.png";
import BackgroundImage1 from "../images/HidaYagi.png"; // 画像のパスを正しく指定
import BackgroundImage2 from "../images/hikanoko.jpg";
import KuchikomiPic from "../images/KuchikomiPic.png";
import SelectPic from "../images/SelectPic.png";

function Home() {
  const [logoClickCount, setLogoClickCount] = useState(0);
  const maxClickCount = 3;
  const [textAnimation, setTextAnimation] = useState("scatter");

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Toggle between 'scatter' and 'bounce'
      setTextAnimation((prevAnimation) =>
        prevAnimation === "scatter" ? "bounce" : "scatter"
      );
    }, 3000);

    // Cleanup the interval to avoid memory leaks
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once

  const handleLogoClick = () => {
    setLogoClickCount((prevCount) => prevCount + 1);
  };

  const getBackgroundImage = () => {
    // クリック数に応じて適切な背景画像のパスを返す
    return logoClickCount < maxClickCount ? BackgroundImage1 : BackgroundImage2;
  };

  const bodyStyle = {
    backgroundImage: `url(${getBackgroundImage()})`,
    backgroundPosition: "center",
    backgroundRepeat: "repeat",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backgroundBlendMode: "lighten",
    height: "100vh",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundSize: "100px",
    overflow: "hidden",
    animation: "moveBackground 10s linear infinite",
  };

  const contentStyle = {
    display: logoClickCount >= maxClickCount ? "none" : "block",
  };

  const replacementContentStyle = {
    display: logoClickCount >= maxClickCount ? "block" : "none",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={bodyStyle}>
      {logoClickCount < maxClickCount ? (
        <div style={contentStyle}>
          <img
            src={HomeLogo}
            alt=""
            className="HomeLogo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
          <button
            className="goHome"
<<<<<<< HEAD
            onClick={() => (window.location.href = "/")}
          >
            ログインへ
=======
            onClick={() => (window.location.href = '/Panda')}>
              ログインへ
>>>>>>> 0751b95e1aa6b116a3bc5ea3b2aa72fcfc3c8321
          </button>
          <div className="Hometitle">
            <h3>口コミ検索かイントロドンを選ぶ</h3>
          </div>
          <div className="AllContent">
            <div className="SearchCon">
              <img src={KuchikomiPic} alt="" className="KuchikomiPic" />
              <button
                className="NextSearchBt"
                onClick={() => (window.location.href = "/Search")}
              >
                口コミ検索へ
              </button>
            </div>
            <div className="IntroCon">
              <img src={SelectPic} alt="" className="SelectPic" />
              <button
                className="IntroBt"
                onClick={() => (window.location.href = "/CategorySelect")}
              >
                イントロドン
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {logoClickCount >= maxClickCount && (
        <div style={replacementContentStyle}>
          {/* 3回クリックされたら表示される新しいコンテンツ */}
          <button
            className={`Command ${textAnimation}`}
            onClick={() => (window.location.href = "/Command")}
          >
            ？？？
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;

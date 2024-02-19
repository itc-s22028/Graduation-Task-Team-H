// import React, { useState } from "react";
// import "./CommandStyle.css";

// const Command = () => {
//   const [guess, setGuess] = useState("");
//   const [result, setResult] = useState("");
//   const [showHomeButton, setShowHomeButton] = useState(false);

//   const correctAnswer = "NAKASONE"; // パズルの正解

//   const handleGuessChange = (event) => {
//     setGuess(event.target.value.toUpperCase());
//   };

//   const handleGuessSubmit = (event) => {
//     event.preventDefault();

//     if (guess === correctAnswer) {
//       setShowHomeButton(true); // 正解ならHOMEボタンを表示
//     } else {
//       setResult("PASSWORDが違います。");
//     }
//   };

//   return (
//     <div className="commandBack">
//       <div className="command-container">
//         <p>PASSWORD</p>
//         <form onSubmit={handleGuessSubmit}>
//           <label>
//             <input
//               className="kaitou-input"
//               type="text"
//               value={guess}
//               onChange={handleGuessChange}
//             />
//           </label>
//         </form>
//         <p>{result}</p>

//         {showHomeButton && (
//           <button
//             className="home-button"
//             onClick={() => (window.location.href = "/NakasoneRoom")}
//           >
//             特別な部屋へ
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Command;

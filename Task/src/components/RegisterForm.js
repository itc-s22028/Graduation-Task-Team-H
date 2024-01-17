<<<<<<< HEAD
import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import "./RegisterFormStyle.css";

function RegisterForm() {
  const [user] = useAuthState(auth);

  return (
    <div className="RegiForm">
      {user ? (
        <>
          <div>
            <h1 className="RegiH1">ログイン完了</h1>
          </div>
          <UserInfo />
          <SignoutButton />
          <Link to="/home">
            <button className="RegiSin">ホーム画面へ</button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="RegiH1">ログインフォーム</h1>
          <SignInButton />
        </>
      )}
    </div>
  );
}
=======

// import React from "react"; // 未使用のimportを削除

// import { auth, provider } from "../firebase";
// import { signInWithPopup } from "firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth"; // 未使用のimportを削除
// import { Link } from "react-router-dom"; // Linkをimport

// import './RegisterFormStyle.css';

// function RegisterForm() {
//     const [user] = useAuthState(auth);

//     return(
//         <div className="RegiForm">
//             {user ? (
//                 <>
//                     <div>
//                         <h1 className="RegiH1">ログイン完了</h1>
//                     </div>
//                     <UserInfo />
//                     <SignoutButton />
//                     <Link to="/home">
//                         <button className="RegiSin">次の画面へ</button>
//                     </Link>
//                 </>
//             ) : (
//                 <>
//                     <h1 className="RegiH1">ログインフォーム</h1>
//                     <SignInButton />
//                 </>
//             )}
//         </div>
//     )
// }

// export default RegisterForm

// // google signin
// function SignInButton() {
//     const signInWithGoogle = () => {
//         // Firebaseを使ってGoogleでログインする
//         signInWithPopup(auth, provider)
//     };

//     return (
//         <button className="RegiSin" onClick={signInWithGoogle}>
//             <p className="RegiP">Googleでサインイン</p>
//         </button>
        
//     )
// }

// function SignoutButton() {
//     return (
//         <button className="RegiO" onClick={() => auth.signOut()}>
//             <p>サインアウト</p>
//         </button>
//     )
// }


// function UserInfo() {
//     return (
//         <div className="userInfo">
//             <img className="RegiImg" src={auth.currentUser.photoURL} alt="" />
//             <p className="RegiP">{auth.currentUser.displayName}</p>
//         </div>
//     );
// }



// import React from "react";
// import { auth, provider } from "../firebase";
// import { signInWithPopup } from "firebase/auth";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { Link } from "react-router-dom";

// import './RegisterFormStyle.css';

// function RegisterForm() {
//     const [user] = useAuthState(auth);

//     return (
//         <div className="RegiForm">
//             {user ? (
//                 <>
//                     <div>
//                         <h1 className="RegiH1">ログイン完了</h1>
//                     </div>
//                     <UserInfo />
//                     <SignoutButton />
//                     <Link to="/home">
//                         <button className="RegiSin">ホーム画面へ</button>
//                     </Link>
//                 </>
//             ) : (
//                 <>
//                     <h1 className="RegiH1">ログインフォーム</h1>
//                     <SignInButton />
//                 </>
//             )}
//         </div>
//     );
// }
>>>>>>> 0751b95e1aa6b116a3bc5ea3b2aa72fcfc3c8321

// export default RegisterForm;

<<<<<<< HEAD
// google signin
function SignInButton() {
  const signInWithGoogle = () => {
    // Firebaseを使ってGoogleでログインする
    signInWithPopup(auth, provider);
  };

  return (
    <button className="RegiSin" onClick={signInWithGoogle}>
      <p className="RegiP">Googleでサインイン</p>
    </button>
  );
}

function SignoutButton() {
  return (
    <button className="RegiO" onClick={() => auth.signOut()}>
      <p>サインアウト</p>
    </button>
  );
}

function UserInfo() {
  return (
    <div className="userInfo">
      <img className="RegiImg" src={auth.currentUser.photoURL} alt="" />
      <p className="RegiP">{auth.currentUser.displayName}</p>
    </div>
  );
}
=======
// // google signin
// function SignInButton() {
//     const signInWithGoogle = () => {
//         // Firebaseを使ってGoogleでログインする
//         signInWithPopup(auth, provider);
//     };

//     return (
//         <button className="RegiSin" onClick={signInWithGoogle}>
//             <p className="RegiP">Googleでサインイン</p>
//         </button>
//     );
// }

// function SignoutButton() {
//     return (
//         <button className="RegiO" onClick={() => auth.signOut()}>
//             <p>サインアウト</p>
//         </button>
//     );
// }

// function UserInfo() {
//     return (
//         <div className="userInfo">
//             <img className="RegiImg" src={auth.currentUser.photoURL} alt="" />
//             <p className="RegiP">{auth.currentUser.displayName}</p>
//         </div>
//     );
// }
>>>>>>> 0751b95e1aa6b116a3bc5ea3b2aa72fcfc3c8321

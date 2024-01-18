import React, { useState, useEffect } from 'react';
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";

import './panda.scss';

const Panda = () => {
    const [isFormUp, setIsFormUp] = useState(false);
    const [eyeBallSize, setEyeBallSize] = useState({ width: 0, height: 0 });
    const [isWrongEntry, setIsWrongEntry] = useState(false);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const dw = window.innerWidth / 11;
            const dh = window.innerHeight / 11;
            const x = event.pageX / dw;
            const y = event.pageY / dh;
            setEyeBallSize({ width: x, height: y });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const handleFocusIn = () => {
        setIsFormUp(true);
    };

    const handleFocusOut = () => {
        setIsFormUp(false);
    };

    const handleButtonClick = () => {
        setIsWrongEntry(true);
        setTimeout(() => {
            setIsWrongEntry(false);
        }, 3000);
    };

    const signInWithGoogle = () => {
        // Firebaseを使ってGoogleでログインする
        signInWithPopup(auth, provider);
    };

    const signOut = () => {
        auth.signOut();
    };

    const PandaInfo = () => {
        if (!auth.currentUser) {
            return null; // ユーザーが存在しない場合の処理
        }

        return (
            <div className="userInfo">
                <img className="PandaImg" src={auth.currentUser.photoURL} alt="" />
                <p className="PandaP2">{auth.currentUser.displayName}</p>
            </div>
        );
    };

    return (
      <div className={`panda ${isWrongEntry ? 'wrong-entry' : ''}`}>
            <div className="ear"></div>
            <div className="face">
                <div className="eye-shade"></div>
                <div className="eye-white">
                    <div className="eye-ball" style={{ width: `${eyeBallSize.width}px`, height: `${eyeBallSize.height}px` }}></div>
                </div>
                <div className="eye-shade rgt"></div>
                <div className="eye-white rgt">
                    <div className="eye-ball" style={{ width: `${eyeBallSize.width}px`, height: `${eyeBallSize.height}px` }}></div>
                </div>
                <div className="nose"></div>
                <div className="mouth"></div>
            </div>
            <div className="body"></div>
            <div className="foot">
                <div className="finger"></div>
            </div>
            <div className="foot rgt">
                <div className="finger"></div>
            </div>
            <div className="PandaForm">
                <div className="hand"></div>
                <div className="hand rgt"></div>
                    {user ? (
                        <>
                            <div>
                                <h1 className="PandaH1">Welcome !!</h1>
                            </div>
                            <PandaInfo />
                            <div className='OutHome'>
                                <SignoutButton />
                                <Link to="/home">
                                    <button className="PandaGoHome">Home</button>
                                </Link>
                            </div>
                       
                        </>
                    ) : (
                      <>
                        <SignInButton />
                      </>
                    )}
                </div>
        </div>
    );
};

export default Panda;


function SignInButton() {
  const signInWithGoogle = () => {
      // Firebaseを使ってGoogleでログインする
      signInWithPopup(auth, provider);
  };

  return (
    <button className="PandaSin" onClick={signInWithGoogle}>
      <p className="PandaP">Google Signin</p>
    </button>
  );
}

function SignoutButton() {
  return (
      <button className="PandaOut" onClick={() => auth.signOut()}>
        <p style={{ fontFamily: 'Dancing Script, cursive' }}>
        Logout
        </p>
      </button>
  );
}

function PandaInfo() {
  return (
      <div className="userInfo">
          <img className="PandaImg" src={auth.currentUser.photoURL} alt="" />
          <p className="PandaP2">{auth.currentUser.displayName}</p>
      </div>
  );
}

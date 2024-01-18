import React from "react";
import { auth } from "../firebase";

function SignoutButton() {
  return (
    <button className="RegiO" onClick={() => auth.signOut()}>
      <p>サインアウト</p>
    </button>
  );
}

export default SignoutButton;

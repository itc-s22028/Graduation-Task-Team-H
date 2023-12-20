import { auth } from "../firebase";
import React from "react";

function UserInfo() {
  const user = auth.currentUser;

  return (
    <div className="userInfo">
      {user && (
        <>
          <img className="RegiImg" src={user.photoURL} alt="" />
          <p className="RegiP">{user.displayName}</p>
        </>
      )}
    </div>
  );
}

export default UserInfo;

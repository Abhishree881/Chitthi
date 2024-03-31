import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Navbar = ({ setImageSrc, setIsOpen }) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="logo">Chitthi</span>
      <div className="user">
        <img
          onClick={(e) => {
            e.stopPropagation();
            setImageSrc(currentUser.photoURL);
            setIsOpen(true);
          }}
          style={{ cursor: "pointer" }}
          src={currentUser.photoURL}
          alt=""
        />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
      alert(err.message);
    }
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chitthi</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <button>Sign in</button>
          {err && <span>Something went wrong </span>}
        </form>
        <p>
          You don't have an account?{" "}
          <Link className="link" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  }

  const compressImage = (file, maxWidth = 200, maxHeight = 200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while preserving aspect ratio
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const compressToMaxLength = async (file, maxChars = 2000) => {
    // Try progressively smaller sizes / quality until we get under maxChars.
    // Firebase Auth seems to reject very long strings (often < 2kb).
    let maxWidth = 120;
    let maxHeight = 120;
    let quality = 0.6;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const compressed = await compressImage(file, maxWidth, maxHeight, quality);
      const base64 = await fileToBase64(compressed);

      if (base64.length <= maxChars) return base64;

      // Reduce size and quality for next attempt
      maxWidth = Math.max(40, Math.floor(maxWidth * 0.7));
      maxHeight = Math.max(40, Math.floor(maxHeight * 0.7));
      quality = Math.max(0.2, quality - 0.1);
    }

    // If we still exceed the limit, return null so caller can decide how to handle it.
    return null;
  };

  const handleSubmit = async (e) => {
    setErr(null);
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    if (!file) {
      setErr("No file selected");
      setLoading(false);
      alert("Please select an avatar image");
      return;
    }

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Compress image and try to keep the base64 small enough for Auth
      const base64Image = await compressToMaxLength(file, 1900);

      // Also generate a larger version for previews (stored in Firestore only)
      const base64Large = await fileToBase64(
        await compressImage(file, 500, 500, 0.85)
      );

      try {
        // Update profile with compressed base64 image when possible
        if (base64Image) {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: base64Image,
            });
          } catch (e) {
            // If Auth rejects the photoURL due to length, fallback to only displayName
            if (e.code === "auth/invalid-profile-attribute") {
              await updateProfile(res.user, { displayName });
            } else {
              throw e;
            }
          }
        } else {
          // If unable to compress small enough, only store displayName in Auth.
          await updateProfile(res.user, { displayName });
        }

        // Create user in Firestore; store both small and preview images
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          displayName,
          email,
          photoURL: base64Image || "",
          photoURLLarge: base64Large || base64Image || "",
        });

        //create empty user chats on firestore
        await setDoc(doc(db, "userChats", res.user.uid), {});
        navigate("/");
      } catch (err) {
        console.log(err);
        setErr(err.message);
        setLoading(false);
        alert(err.message);
      }
    } catch (err) {
      console.log(err);
      setErr(err.message);
      setLoading(false);
      alert(err.message);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chitthi</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input required type="text" placeholder="Display name" />
          <input required type="email" placeholder="Email" />
          <input required type="password" placeholder="Password" />
          <input required type="file" id="file" accept="image/*" onChange={handleChange} />
          {
            !file ? (
              <label htmlFor="file">
                <img src={Add} alt="" />
                <span>Add an avatar</span>
              </label>
            ) : (
              <div className="image-preview">
                <img src={URL.createObjectURL(file)} alt="Avatar preview" />
                <button type="button" onClick={() => setFile(null)} className="remove-image">×</button>
              </div>
            )
          }
          <button disabled={loading}>Sign up</button>
          {loading && <span className="loading">Signing up please wait... </span>}
          {err && <span className="error">{err}</span>}
        </form>
        <p>
          You do have an account?{" "}
          <Link className="link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

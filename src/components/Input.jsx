import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";
import { IoCloseSharp } from "react-icons/io5";

const Modal = ({
  modal,
  imageSrc,
  setText,
  handleKeyPress,
  handleSend,
  text,
  onClose,
}) => {
  if (!modal) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>
          <IoCloseSharp style={{ fontSize: "20px" }} />
        </span>
        <img
          style={{ borderRadius: "10px 10px 0px 0px" }}
          src={imageSrc}
          alt="Preview"
        />
        <div>
          <input
            type="text"
            placeholder="Enter Caption"
            onChange={(e) => setText(e.target.value)}
            value={text}
            onKeyPress={handleKeyPress}
          />
          <button style={{ borderRadius: "3px" }} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const Input = ({ setApi }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [modal, setModal] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [selectedImage, setSelectedImage] = useState(null);

  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
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

  const onClose = (e) => {
    setModal(false);
    setImg(null);
    setSelectedImage(null);
    setText("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    setApi(true);
    const textMessage = text;
    setText("");
    if (img) {
      try {
        // Compress image and convert to base64
        const compressedFile = await compressImage(img);
        const base64Image = await fileToBase64(compressedFile);

        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: textMessage,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: base64Image,
          }),
        });
      } catch (error) {
        console.error("Error processing image:", error);
        // Fallback to sending text only if image processing fails
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: textMessage,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });
      }
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: textMessage,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    setImg(null);
    onClose();
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text: textMessage,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: textMessage,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSend();
    }
  };
  return (
    <div className="input">
      <Modal
        modal={modal}
        imageSrc={selectedImage}
        setText={setText}
        handleSend={handleSend}
        handleKeyPress={handleKeyPress}
        text={text}
        onClose={onClose}
      />
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyPress={handleKeyPress}
      />
      <div className="send">
        {/* <img src={Attach} alt="" /> */}
        <input
          type="file"
          className="file-chat"
          id="file"
          onChange={(e) => {
            setImg(e.target.files[0]);
            handleImageChange(e);
            setModal(true);
          }}
          accept="image/*"
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button style={{ borderRadius: "3px" }} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;

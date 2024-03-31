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
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: textMessage,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
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

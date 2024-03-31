import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message, setImageSrc, setIsOpen }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  // console.log(message);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          onClick={(e) => {
            e.stopPropagation();
            setImageSrc(
              message.senderId === currentUser.uid
                ? currentUser.photoURL
                : data.user.photoURL
            );
            setIsOpen(true);
          }}
          style={{ cursor: "pointer" }}
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        {/* <span>just now</span> */}
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message.img && (
          <img
            onClick={(e) => {
              e.stopPropagation();
              setImageSrc(message.img);
              setIsOpen(true);
            }}
            style={{ cursor: "pointer" }}
            src={message.img}
            alt=""
          />
        )}
      </div>
    </div>
  );
};

export default Message;

import React, { useContext } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/stats");
  };

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <button
            style={{
              cursor: "pointer",
              backgroundColor: "#DDDDF7",
              border: "none",
              color: "#5D5B8D",
              borderRadius: "2px",
            }}
            onClick={handleClick}
          >
            Mood
          </button>
          <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;

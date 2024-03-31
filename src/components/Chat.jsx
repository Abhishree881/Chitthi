import React, { useContext, useState, useEffect } from "react";
import Cam from "../img/cam.png";
import Add from "../img/add.png";
import More from "../img/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";
import { isMobile } from "react-device-detect";
import { IoMdArrowBack } from "react-icons/io";

const Chat = ({ setIsSidebarOpen, setImageSrc, setIsOpen }) => {
  const [mood, setMood] = useState();
  const [api, setApi] = useState(false);
  const { data } = useContext(ChatContext);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/stats");
  };
  useEffect(() => {
    // axios()
    if (data?.user?.uid) {
      getApiData();
    }
  }, [data]);
  useEffect(() => {
    if (api) {
      getApiData();
      setApi(false);
    }
  }, [api]);
  const getApiData = async () => {
    const response = await fetch(
      `https://chitthi-abhi881.koyeb.app/mood/${data.user.uid}`
    ).then((response) => response.json());
    const arrayOfValues = Object.keys(response);
    setMood(arrayOfValues[0]);
  };
  const handleBackClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };
  return (
    <div className="chat">
      <div className="chatInfo">
        <div className="chatInfoTop">
          {isMobile ? <IoMdArrowBack onClick={handleBackClick} /> : null}
          <img
            onClick={(e) => {
              e.stopPropagation();
              setImageSrc(data.user?.photoURL);
              setIsOpen(true);
            }}
            style={{ cursor: "pointer" }}
            className="userImage"
            src={data.user?.photoURL}
            alt=""
          />
          <span>{data.user?.displayName}</span>
        </div>
        <div className="chatIcons">
          <button onClick={handleClick}>
            {mood ? <span>{mood}</span> : <span>Mood</span>}
          </button>
          {/* <img src={Cam} alt="" />
          <img src={Add} alt="" />
          <img src={More} alt="" /> */}
        </div>
      </div>
      <Messages setImageSrc={setImageSrc} setIsOpen={setIsOpen} />
      <Input setApi={setApi} />
    </div>
  );
};

export default Chat;

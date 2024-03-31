import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import { BrowserView, MobileView } from "react-device-detect";
import Modal from "../components/Model";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const onClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <BrowserView>
        <Modal isOpen={isOpen} onClose={onClose} imageSrc={imageSrc} />
        <div className="home">
          <div className="container">
            <Sidebar
              setIsSidebarOpen={setIsSidebarOpen}
              setImageSrc={setImageSrc}
              setIsOpen={setIsOpen}
            />
            {isSidebarOpen ? (
              <Chat
                setIsSidebarOpen={setIsSidebarOpen}
                setImageSrc={setImageSrc}
                setIsOpen={setIsOpen}
              />
            ) : null}
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <Modal isOpen={isOpen} onClose={onClose} imageSrc={imageSrc} />
        <div className="home">
          <div className="container">
            {isSidebarOpen ? (
              <Chat
                setIsSidebarOpen={setIsSidebarOpen}
                setImageSrc={setImageSrc}
                setIsOpen={setIsOpen}
              />
            ) : (
              <Sidebar
                setIsSidebarOpen={setIsSidebarOpen}
                setImageSrc={setImageSrc}
                setIsOpen={setIsOpen}
              />
            )}
          </div>
        </div>
      </MobileView>
    </>
  );
};

export default Home;

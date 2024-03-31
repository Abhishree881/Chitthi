import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import { isMobile } from "react-device-detect";

const Sidebar = ({ setIsSidebarOpen, setImageSrc, setIsOpen }) => {
  return (
    <div className={isMobile ? "mobile-sidebar" : "sidebar"}>
      <Navbar setImageSrc={setImageSrc} setIsOpen={setIsOpen} />
      <Search />
      <Chats
        setIsSidebarOpen={setIsSidebarOpen}
        setImageSrc={setImageSrc}
        setIsOpen={setIsOpen}
      />
    </div>
  );
};

export default Sidebar;

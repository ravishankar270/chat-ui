import React from "react";
import Image from "react-bootstrap/Image";
import profile from "./profile.jpg";
import "./ChatItem.css"
const ChatItem = ({name}) => {

  return (
    <div className="d-flex m-2 border-bottom p-2 chat-list">
      <Image src={profile} roundedCircle  style={{height:"50px"}} />
      <div className="ms-2 me-auto">
        <div className="fw-bold">{name}</div>
      </div>
    </div>
  );
};

export default ChatItem;

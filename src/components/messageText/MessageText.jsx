import React from "react";
import "./MessageText.css";

const MessageText = ({ msg, name, time }) => {
  return (
    <div className="mssg-grid-right">
      <div className="mssg-text">
        <div className="mssg-user">{name}</div>
        {msg}
        <div className="mssg-time">{time}</div>
      </div>
    </div>
  );
};

export default MessageText;

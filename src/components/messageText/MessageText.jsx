import React from "react";
import "./MessageText.css";
import { getTime } from "../../utils/common.utils";

const MessageText = ({ msg, name, timestamp }) => {
  return (
    <div className={name === "" ? "mssg-grid-left" : "mssg-grid-right"}>
      <div className="mssg-text">
        <div className="mssg-user text-capitalize">{name}</div>
        {msg}
        <div className="mssg-time">{getTime(timestamp)}</div>
      </div>
    </div>
  );
};

export default MessageText;

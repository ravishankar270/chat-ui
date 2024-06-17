import React, { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import "./ChatItem.css";
import { getTime } from "../../utils/common.utils";
import { socket } from "../../Socket";

const ChatItem = ({ userData, setDetailsInfo, unread, onClick }) => {
  const [message, setMessage] = useState(null);
  const viewChat = () => {
    console.log(userData);
    onClick?.();
    setDetailsInfo(userData);
    (unread ||
      (message &&
        message.from !== sessionStorage.getItem("id") &&
        userData.userMessages.unread !== 0)) &&
      socket.emit("read", {
        sender: sessionStorage.getItem("id"),
        receiver: unread ? unread.id : message.from,
      });
  };
  console.log(userData, "iop");
  useEffect(() => {
    setMessage(
      userData?.userMessages?.messages
        ? userData.userMessages.messages.length > 0
          ? userData.userMessages.messages.slice(-1)[0]
          : null
        : null
    );
  }, [userData]);
  console.log(message);
  return (
    <div className="d-flex m-2 border-bottom p-2 chat-item" onClick={viewChat}>
      <Image
        referrerpolicy="no-referrer"
        src={userData.image}
        roundedCircle
        style={{ height: "45px" }}
      />
      <div className="ms-2 me-auto d-flex flex-column align-items-start messageInfo">
        <div className="d-flex justify-content-between message">
          <div className="fw-bold text-capitalize">{userData.name}</div>
          <h6 className="time">
            {message && getTime(message.timestamp, false)}
          </h6>
        </div>
        <div className="d-flex justify-content-between popup-container">
          <div className="subMessage">
            {message
              ? message.from === sessionStorage.getItem("id")
                ? `You: ${message.message}`
                : message.message
              : ""}
          </div>
          {/* {(unread && parseInt(unread.read) !== 0) ||
          (message &&
            message.from !== sessionStorage.getItem("id") &&
            userData.userMessages.unread !== 0) ? (
            <div className="unread-popup">
              <p>{unread ? unread.read : userData.userMessages.unread}</p>
            </div>
          ) : (
            ""
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;

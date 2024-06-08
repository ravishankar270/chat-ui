import React, { useEffect, useState } from "react";
import Image from "react-bootstrap/Image";
import profile from "../chatItem/profile.jpg";
import "./ChatItemDetail.css";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { socket } from "../../Socket";
import MessageText from "../messageText/MessageText";

const ChatItemDetail = ({ usersTyping }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleMessage = (data) => {
      console.log("inside", data);
      setMessages((msg) => [...msg, data]);
    };
    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const handleKeyPressDown = () => {
    socket.emit("activity", socket.id.substring(0, 5));
  };

  const handleClick = () => {
    if (currentMsg !== "") {
      socket.emit("message", currentMsg);
      setCurrentMsg("");
    }
  };
  return (
    <div className="detail-container">
      <div className="user-info">
        <Image src={profile} roundedCircle style={{ height: "50px" }} />
        <div className="ms-2 me-auto">
          <div className="fw-bold" sty le={{ fontSize: "20px" }}>
            Name
          </div>
          <div className="d-flex">
            <span class="logged-in">●</span>
            <div style={{ fontSize: "14px", color: "gray" }}>Online </div>
          </div>
        </div>
      </div>
      <div className="mssg-container">
        {messages.map((msg) => (
          <MessageText msg={msg} name={"Ravi"} time={"10.31 pm"} />
        ))}
      </div>
      <div
        className="d-flex"
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          height: "7%",
        }}
      >
        {usersTyping.length > 0 && (
          <i className="typing-user">{usersTyping.toString()} is Typing...</i>
        )}
        <div className="d-flex" style={{ width: "100%", alignItems: "center" }}>
          <Form.Control
            className="msg-input"
            type="text"
            placeholder="Type Message"
            onKeyDown={handleKeyPressDown}
            value={currentMsg}
            onChange={(event) => setCurrentMsg(event.target.value)}
            
          />
          <FontAwesomeIcon
            color="#6210CC"
            className="send"
            size="xl"
            onClick={handleClick}
            icon={faPaperPlane}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatItemDetail;

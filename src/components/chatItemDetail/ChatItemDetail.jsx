import React, { useEffect, useRef, useState } from "react";
import Image from "react-bootstrap/Image";
import "./ChatItemDetail.css";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faLock,
  faAngleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { socket } from "../../Socket";
import MessageText from "../messageText/MessageText";
import login from "../../assets/login.jpg";

const ChatItemDetail = ({
  usersTyping,
  detailsInfo,
  setUsersTyping,
  handleView,
  handleUpdateUserData,
}) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const msgRef = useRef(null);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleMessage = (data) => {
      setUsersTyping([]);
      setMessages((msg) => [...msg, data]);
      handleUpdateUserData({
        ...detailsInfo,
        newMessage: data,
      });
    };
    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [detailsInfo]);

  useEffect(() => {
    if (detailsInfo) {
      console.log(detailsInfo.userMessages);
      detailsInfo.userMessages
        ? setMessages(detailsInfo.userMessages.messages)
        : setMessages([]);
      setCurrentMsg("")
    }
  }, [detailsInfo]);

  const handleKeyPressDown = (event) => {
    if (event.key === "Enter") {
      handleClick();
    } else {
      socket.emit("activity", sessionStorage.getItem("name"));
    }
  };

  const handleClick = () => {
    if (currentMsg !== "") {
      socket.emit("message", {
        sender: sessionStorage.getItem("id"),
        receiver: detailsInfo._id,
        message: currentMsg,
        socketId: detailsInfo.socketId,
      });
      setCurrentMsg("");
    }
  };
  return (
    <div className="detail-container">
      {detailsInfo ? (
        <>
          <div className="user-info">
            <FontAwesomeIcon
              size="xl"
              className="back-icon"
              onClick={handleView}
              icon={faAngleLeft}
            />
            <Image
              referrerpolicy="no-referrer"
              src={detailsInfo.image}
              roundedCircle
              style={{ height: "45px" }}
            />
            <div className="ms-2 me-auto">
              <div
                className="fw-bold text-capitalize"
                sty
                le={{ fontSize: "20px" }}
              >
                {detailsInfo.name}
              </div>
              <div
                className="d-flex"
                style={{ justifyContent: "center", alignContent: "center" }}
              >
                <span
                  className={detailsInfo?.active ? "logged-in" : "logged-out"}
                >
                  ●
                </span>
                <div
                  style={{ fontSize: "14px", color: "gray", fontSize: "14px" }}
                >
                  {detailsInfo?.active ? "Online" : "Offline"}{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="mssg-container" ref={msgRef}>
            {messages.map((data) => (
              <MessageText
                msg={data.message}
                name={
                  sessionStorage.getItem("id") === data.from
                    ? ""
                    : detailsInfo.name
                }
                timestamp={data.timestamp}
              />
            ))}
          </div>
          <div
            className="d-flex"
            style={{
              alignItems: "flex-start",
              height: "5%",
              marginTop: "10px",
              position: "relative",
            }}
          >
            {usersTyping.length > 0 && (
              <i className="typing-user">
                {usersTyping.toString()} is Typing...
              </i>
            )}
            <div
              className="d-flex"
              style={{ width: "100%", alignItems: "center" }}
            >
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
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "20px",
            height: "100%",
            fontFamily: "monospace",
            justifyContent: "space-around",
          }}
        >
          <>
            <Image
              src={login}
              width={"60%"}
              style={{
                display: "flex",
                alignItems: "center",
                margin: "auto",
              }}
            />
            No chat Selected
          </>
          <i style={{ fontSize: "16px" }}>
            <FontAwesomeIcon
              size="sm"
              icon={faLock}
              style={{
                marginRight: "10px",
              }}
            />
            Your messages are end to end encrypted
          </i>
        </div>
      )}
    </div>
  );
};

export default ChatItemDetail;

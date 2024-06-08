import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import ChatItem from "../components/chatItem/ChatItem";
import ChatItemDetail from "../components/chatItemDetail/ChatItemDetail";
import { socket } from "../Socket";

const Chat = ({ usersTyping }) => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const handleUserConnection = (user) => {
      setUsers((users) => [...users, user]);
    };
    socket.on("connected", handleUserConnection);

    return () => {
      socket.off("connected", handleUserConnection);
    };
  }, []);
  return (
    <>
      <Header></Header>
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "30%",
            overflowY: "auto",
            height: "100vh",
            borderRight: "4px solid #6210CC",
          }}
        >
          {users.map((x, i) => (
            <ChatItem name={x} />
          ))}
        </div>
        <div
          style={{
            width: "70%",
          }}
        >
          <ChatItemDetail usersTyping={usersTyping} />
        </div>
      </div>
    </>
  );
};

export default Chat;

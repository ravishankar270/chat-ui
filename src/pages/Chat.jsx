import React, { useEffect, useState } from "react";
import Header from "../components/header/Header";
import ChatItem from "../components/chatItem/ChatItem";
import ChatItemDetail from "../components/chatItemDetail/ChatItemDetail";
import { useNavigate } from "react-router-dom";
import axios from "../apiConfig/axios.config";
import { socket } from "../Socket";
import "./Chat.css";
const Chat = ({ usersTyping, auth, users, setAuth, setUsersTyping }) => {
  const [detailsInfo, setDetailsInfo] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [offlineUsers, setOfflineUsers] = useState([]);
  const [unread, setUnread] = useState([]);
  const [isMoved, setIsMoved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) navigate("/login");
  }, []);

  useEffect(() => {
    if (auth) {
      const handleRead = (data) => {
        const dataExists = idExists(data.id);
        if (dataExists) {
          const result = unread.map((readData) =>
            readData.id === data.id
              ? {
                  ...data,
                  read: data.read,
                }
              : readData
          );
          setUnread(result);
        } else {
          setUnread((unread) => [...unread, data]);
        }
      };
      const handleUnread = (id) => {
        if (unread.length === 0) {
          const newActiveUsers = activeUsers?.map((user) => {
            if (
              user.userMessages?.participant1 === id ||
              user.userMessages?.participant2 === id
            ) {
              return {
                ...user,
                userMessages: {
                  ...user.userMessages,
                  unread: 0,
                },
              };
            } else {
              return user;
            }
          });
          const newOfflineUsers = offlineUsers?.map((user) => {
            if (
              user.userMessages?.participant1 === id ||
              user.userMessages?.participant2 === id
            ) {
              return {
                ...user,
                userMessages: {
                  ...user.userMessages,
                  unread: 0,
                },
              };
            } else {
              return user;
            }
          });
          setActiveUsers(newActiveUsers);
          setOfflineUsers(newOfflineUsers);
        } else {
          const result = unread.filter((readData) => readData.id !== id);
          setUnread(result);
        }
      };

      socket.on("message_added", handleRead);
      socket.on("updated_unread", handleUnread);
      return () => {
        socket.off("message_added", handleRead);
        socket.off("updated_unread", handleUnread);
      };
    }
  }, [auth, activeUsers, offlineUsers]);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const getCurrentUserMsgs = async () => {
      const result = await axios.get(
        `/api/chats/${sessionStorage.getItem("id")}`
      );
      const usersWithMessages = users.map((user) => ({
        ...user,
        userMessages: result.data.find(
          (msg) =>
            msg.participant1 === user._id || msg.participant2 === user._id
        ),
      }));
      const newOfflineUsers = usersWithMessages.filter(
        (user) => !user?.active && email !== user.email
      );
      const newActiveUsers = usersWithMessages.filter(
        (user) => user?.active && email !== user.email
      );
      setOfflineUsers(newOfflineUsers);
      setActiveUsers(newActiveUsers);
    };
    auth && getCurrentUserMsgs();
  }, [users, auth]);

  const idExists = (id) => {
    const data = unread.find((data) => data.id === id);
    return data;
  };

  const handleView = () => {
    setIsMoved(!isMoved);
  };

  const handleUpdateUserData = (data) => {
    if (data.active) {
      setActiveUsers((activeUsers) =>
        activeUsers.map((user) => {
          if (
            user?.userMessages?._id === data?.userMessages?._id &&
            user.userMessages?._id &&
            data.userMessages._id
          ) {
            return {
              ...user,
              userMessages: {
                ...user.userMessages,
                messages: [...user.userMessages.messages, data.newMessage],
              },
            };
          } else {
            return user;
          }
        })
      );
    } else {
      setOfflineUsers((offlineUsers) =>
        offlineUsers.map((user) => {
          if (
            user.userMessages?._id === data.userMessages?._id &&
            user.userMessages?._id &&
            data.userMessages._id
          ) {
            return {
              ...user,
              userMessages: {
                ...user.userMessages,
                messages: [...user.userMessages.messages, data.newMessage],
              },
            };
          } else {
            return user;
          }
        })
      );
    }
  };
  return (
    <>
      <Header setAuth={setAuth}></Header>
      <div className="chat-container">
        <div className="chat-item-container">
          <h6 style={{ color: "green" }}>Active Users</h6>
          <hr />
          {activeUsers.map((user, i) => (
            <ChatItem
              userData={user}
              setDetailsInfo={setDetailsInfo}
              unread={idExists(user._id)}
              onClick={handleView}
            />
          ))}
          <h6 style={{ color: "red" }}>Offline Users</h6>
          <hr />
          {offlineUsers.map((user, i) => (
            <ChatItem
              userData={user}
              setDetailsInfo={setDetailsInfo}
              unread={idExists(user._id)}
              onClick={handleView}
            />
          ))}
        </div>
        <div className={`chat-detail-container ${isMoved ? "move" : ""}`}>
          <ChatItemDetail
            usersTyping={usersTyping}
            detailsInfo={detailsInfo}
            setUsersTyping={setUsersTyping}
            handleView={handleView}
            handleUpdateUserData={handleUpdateUserData}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;

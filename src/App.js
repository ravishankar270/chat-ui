import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import Chat from "./pages/Chat";
import { useEffect, useRef, useState } from "react";
import { socket } from "./Socket";
import Login from "./pages/Login";
import axios from "./apiConfig/axios.config";

function App() {
  const [auth, setAuth] = useState(false);
  const [users, setUsers] = useState([]);
  const intialRef = useRef(true);
  const [usersTyping, setUsersTyping] = useState([]);
  let activityTimer;

  useEffect(() => {
    const user = sessionStorage.getItem("email");
    user && setAuth(true);
    if (intialRef.current && (auth || user)) {
      intialRef.current = false;

      socket.connect();
      socket.emit("user_connected", {
        name: sessionStorage.getItem("name"),
        email: sessionStorage.getItem("email"),
      });
    }
    return () => {
      socket.off("user_connected", {
        name: sessionStorage.getItem("name"),
        email: sessionStorage.getItem("email"),
      });
    };
  }, [auth]);

  useEffect(() => {
    if (auth) {
      const handleUsers = async () => {
        const registeredUsers = await axios.get("/api/users/");
        setUsers(registeredUsers.data);
      };

      socket.on("online_users", handleUsers);
      socket.on("new_user", handleUsers);
      socket.on("user_disconnected", handleUsers);
      return () => {
        socket.off("online_users", handleUsers);
        socket.off("new_user", handleUsers);
        socket.off("user_disconnected", handleUsers);
      };
    }
  }, [auth]);

  useEffect(() => {
    const handleActivity = (name) => {
      setUsersTyping((usersTyping) => {
        return usersTyping.includes(name)
          ? usersTyping
          : [...usersTyping, name];
      });
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        setUsersTyping([]);
      }, 3000);
    };
    socket.on("activity", handleActivity);

    return () => {
      socket.off("activity", handleActivity);
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="/"
              element={
                <Chat
                  auth={auth}
                  usersTyping={usersTyping}
                  users={users}
                  setAuth={setAuth}
                  setUsersTyping={setUsersTyping}
                />
              }
            />
            <Route
              path="/login"
              element={<Login auth={auth} setAuth={setAuth} />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

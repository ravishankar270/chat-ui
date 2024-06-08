import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import Chat from "./pages/Chat";
import { useEffect, useState } from "react";
import { socket } from "./Socket";
import Login from "./pages/Login";

function App() {
  const [usersTyping, setUsersTyping] = useState([]);
  let activityTimer;

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
    }
    socket.on("activity", handleActivity);

    return () => {
      socket.off("activity",handleActivity)
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Chat usersTyping={usersTyping} />} />
            <Route path="/login" element ={<Login/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

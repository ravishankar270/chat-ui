import React, { useEffect } from "react";
import login from "../assets/login.jpg";
import {  Image } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "../apiConfig/axios.config";
import { socket } from "../Socket";
import "./Login.css";
const Login = ({ auth, setAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) navigate("/");
  }, [auth]);

  const responseMessage = async (response) => {
    const decoded = jwtDecode(response.credential);
    const user = await axios.post("/api/users/", {
      name: decoded.given_name,
      email: decoded.email,
      image: decoded.picture,
    });
    sessionStorage.setItem("email", user.data.email);
    sessionStorage.setItem("name", user.data.name);
    sessionStorage.setItem("id", user.data._id);
    sessionStorage.setItem("image", decoded.picture);
    socket.connect();
    socket.emit("user_connected", {
      name: decoded.given_name,
      email: decoded.email,
    });
    setAuth(true);
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Image src={login} width={"50%"} height={"80%"} className="logo" />
      <div className="google">
        <h1 style={{ color: "#6210CC", fontFamily: "cursive" }}> Chat IT </h1>
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
    </div>
  );
};

export default Login;

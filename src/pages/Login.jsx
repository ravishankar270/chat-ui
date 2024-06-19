import React, { useEffect, useState } from "react";
import login from "../assets/login.jpg";
import { Image } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "../apiConfig/axios.config";
import { socket } from "../Socket";
import "./Login.css";
import { ThreeDots } from "react-loader-spinner";
const Login = ({ auth, setAuth }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (auth) navigate("/");
  }, [auth]);

  const responseMessage = async (response) => {
    const decoded = jwtDecode(response.credential);
    setLoading(true);
    const user = await axios.post("/api/users/", {
      name: decoded.given_name,
      email: decoded.email,
      image: decoded.picture,
    });
    setLoading(false);
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
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="backdrop"
        style={{ ...(loading ? { display: "block" } : { display: "none" }) }}
        id="backdrop"
      ></div>
      {loading && (
        <div className={"loader"}>
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#6210cc"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      )}

      <div className="google">
        <h1 style={{ color: "#6210CC", fontFamily: "cursive" }}> Chat IT </h1>
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
      <Image src={login} width={"50%"} height={"80%"} className="logo" />
    </div>
  );
};

export default Login;

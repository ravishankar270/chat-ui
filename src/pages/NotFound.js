import React from "react";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <iframe
        src="https://giphy.com/embed/BweKhXaocjST6cnWMH"
        width="380"
        height="380"
        frameBorder="0"
        class="giphy-embed"
        allowFullScreen
        style={{
          pointerEvents: "none",
        }}
      ></iframe>
    </div>
  );
};

export default NotFound;

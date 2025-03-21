import React from "react";

const BubbleChat = ({ children, isUser = true }) => {
  return (
    <div
      className={`p-2 my-1 rounded-md shadow-sm ${
        isUser ? "bg-white text-end" : "bg-green-300 text-start"
      }`}
    >
      {children}
    </div>
  );
};

export default BubbleChat;

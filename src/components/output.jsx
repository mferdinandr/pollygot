import React from "react";

const Output = ({ content }) => {
  return (
    <textarea
      className="bg-black/10 w-full h-[105px] rounded-md p-2"
      value={content}
      disabled
    />
  );
};

export default Output;

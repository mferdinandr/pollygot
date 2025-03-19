import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="w-md h-[90vh] mx-auto my-10 flex flex-col flex-1 shadow-md shadow-gray-200 fixed left-1/2 -translate-x-1/2">
      <img
        src="/public/header.png"
        alt="header image"
        className="rounded-t-lg"
      />
      <div className="border-2 border-black mx-3 my-5 rounded-lg h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Layout;

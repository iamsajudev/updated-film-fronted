import React from "react";
import { HashLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <HashLoader color="#165588" size={60} />
    </div>
  );
};

export default Loading;
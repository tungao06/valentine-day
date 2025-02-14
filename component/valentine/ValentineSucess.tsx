import { success } from "@utils/dataset/gif";
import React from "react";

const ValentineSucess = () => {
  return (
    <div className="bg-[#ffadad] px-4 py-4 border-2 border-[#ffadad] rounded-xl border-solid min-w-[350px] max-w-screen max-h-screen min-h-[450px] flex items-center justify-center">
      <div className="flex flex-col justify-center gap-4 items-center">
        <img
          loading="lazy"
          className="h-[230px] w-[230px] rounded-lg shadow-lg"
          src={success[Math.floor(Math.random() * success.length)]}
        />
        <p className="text-3xl">Ohh Yeaaaaaa ...</p>
        <div className="flex flex-wrap items-center justify-center gap-2"></div>
      </div>
    </div>
  );
};

export default ValentineSucess;

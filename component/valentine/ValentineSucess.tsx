import { success } from "@utils/dataset/gif";
import { useRouter } from "next/router";
import React from "react";

const ValentineSucess = () => {
  const router = useRouter();
  return (
    <div className="bg-[#ffadad] px-4 py-4 border-2 border-[#ffadad] rounded-xl border-solid min-w-[350px] max-w-screen max-h-screen min-h-[450px] flex items-center justify-center">
      <div className="flex flex-col justify-center gap-8 items-center">
        <img
          loading="lazy"
          className="h-[230px] w-[230px] rounded-lg shadow-lg bg-white"
          src={success[Math.floor(Math.random() * success.length)]}
        />
        <p className="text-3xl">Ohh Yeaaaaaa ...</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            className={`animate-bounce bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-2xl`}
            onClick={() => router.push("message")}
          >
            Let's go
          </button>
          <button
            className={`animate-bounce bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-2xl`}
            onClick={() => router.push("countdown")}
          >
            Anniversary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValentineSucess;

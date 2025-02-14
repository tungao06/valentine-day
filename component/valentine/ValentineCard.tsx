import { main } from "@utils/dataset/gif";
import { phrases } from "@utils/dataset/wording";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const ValentineCard = () => {
  const router = useRouter();
  const [mvBtn, setMvBtn] = useState("");
  const [styleBntNo, setStyleBntNo] = useState({});

  const [noCount, setNoCount] = useState(0);

  // btn size
  const [yesSizeHeight, setYesSizeHeight] = useState(0);
  const [yesSizeWidth, setYesSizeWidth] = useState(0);
  const [noSizeHeight, setNoSizeHeight] = useState(0);
  const [noSizeWidth, setNoSizeWidth] = useState(0);
  const [yesFontSize, setYesFontSize] = useState(16);

  const getNoButtonText = useMemo(() => {
    return phrases[noCount];
  }, [noCount]);

  const onClickNo = () => {
    setStyleBntNo({
      top: Math.floor(Math.random() * (window.innerHeight - noSizeHeight)),
      left: Math.floor(Math.random() * (window.innerWidth - noSizeWidth)),
    });
    setMvBtn(`fixed`);
    setNoCount((prev) => prev + 1);
    if (yesSizeWidth < window.innerWidth - 50) setYesFontSize(noCount * 5 + 16);
  };

  useEffect(() => {}, []);
  return (
    <div className="bg-[#ffadad] px-4 py-4 border-2 border-[#ffadad] rounded-xl border-solid min-w-[350px] max-w-screen max-h-screen min-h-[450px] flex items-center justify-center">
      <div className="flex flex-col justify-center gap-4 items-center">
        <img
          loading="lazy"
          className="h-xs w-xs rounded-lg shadow-lg bg-white"
          src={main[Math.floor(Math.random() * main.length)]}
        />
        <p className="text-3xl">Do you love me....?</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            ref={(el) => {
              if (!el) return;

              setYesSizeWidth(el.getBoundingClientRect().width);
              setYesSizeHeight(el.getBoundingClientRect().height);
            }}
            className={`animate-bounce bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg`}
            style={{ fontSize: yesFontSize }}
            onClick={() => router.push("success")}
          >
            Yesssss
          </button>
          <button
            ref={(el) => {
              if (!el) return;

              setNoSizeWidth(el.getBoundingClientRect().width);
              setNoSizeHeight(el.getBoundingClientRect().height);
            }}
            className={`bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-bold py-2 px-4 ${mvBtn}`}
            style={styleBntNo}
            onMouseOver={() => {
              console.log("hoverstart");
              onClickNo();
            }}
            onTouchStart={() => {
              console.log("touchstart");
              onClickNo();
            }}
          >
            {noCount === 0 ? "Nope" : getNoButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValentineCard;

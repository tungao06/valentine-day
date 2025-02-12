import React from "react";

const ValentineCard = () => {
  return (
    <div className="bg-fuchsia-200 px-4 py-2 border-2 border-fuchsia-200 rounded-xl border-solid min-w-[350px] max-w-screen max-h-screen min-h-[450px] flex items-center justify-center">
      <div className="flex flex-col justify-center gap-4 items-ceter">
        <img
          loading="lazy"
          className="h-[230px] rounded-lg shadow-lg"
          src={
            "https://gifdb.com/images/high/cute-love-swirl-around-cat-9c27zdppmrnmzx4c.webp"
          }
        />
        <p className="text-3xl tangerine-bold">Do you love me....?</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            ref={(el) => {
              if (!el) return;

              //   setYesSize(el.getBoundingClientRect().width);
            }}
            className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg`}
            // style={{ fontSize: yesFontSize }}
            // onClick={() => setYesPressed(true)}
          >
            Yesssss
          </button>
          <button
            ref={(el) => {
              if (!el) return;

              //   setNoSizeWidth(el.getBoundingClientRect().width);
              //   setNoSizeHeight(el.getBoundingClientRect().height);
            }}
            // onClick={handleNoClick}
            // disabled={loading}
            className={`bg-rose-500 hover:bg-rose-600 rounded-lg text-white font-bold py-2 px-4`}
            // style={{
            //   bottom: `${bottom}px`,
            //   right: `${right}px`,
            // }}
          >
            Nope
            {/* {noCount === 0 ? "No" : getNoButtonText()} */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValentineCard;

import { useRouter } from "next/router";
import React, { useEffect } from "react";
import RealisticRedRibbon from "../../assets/realistic-red-ribbon.png";

const ValentineMessage = () => {
  const router = useRouter();
  const [language, setLanguage] = React.useState("เปลี่ยนเป็นภาษาไทย");
  const [switchLanguage, setSwitchLanguage] = React.useState(true);

  const onClickTranslate = () => {
    if (switchLanguage) {
      setSwitchLanguage(false);
      setLanguage("Change to English");
    } else {
      setSwitchLanguage(true);
      setLanguage("เปลี่ยนเป็นภาษาไทย");
    }
  };
  
  return (
    <div className="bg-[#ffadad] relative px-4 py-4 border-2 border-[#ffadad] sm:rounded-xl border-solid min-w-[350px] sm:max-w-screen max-w-100 sm:max-h-screen min-h-[450px] h-screen sm:h-full flex items-center justify-center">
      <img
        loading="lazy"
        className="h-xs w-xs rounded-lg absolute top-0 left-0 opacity-40"
        src={RealisticRedRibbon.src}
      />
      <div className="flex flex-col justify-center gap-4 items-center">
        <div
          id="letter"
          className="max-w-3xl mx-auto p-8 bg-pink-50 shadow-xl rounded-2xl"
        >
          <div className="text-right mb-4">
            <button
              onClick={onClickTranslate}
              className={`text-xs px-4 py-2 relative opacity-80 bg-red-500 text-white rounded-full hover:bg-red-600 transition ${switchLanguage ? "sriracha-regular" : ""}`}
            >
              {language}
            </button>
          </div>
          {switchLanguage ? (
            <div
              id="englishContent"
              className="leading-relaxed text-justify text-gray-800"
            >
              <p className="mb-4 text-xl">Happy Valentine’s Day, my love,</p>
              <p>
                Every day with you is my favorite day. You make my world
                brighter just by being in it. I love the way we laugh at the
                smallest things, how we understand each other without even
                saying a word, and the comfort of knowing you’re always by my
                side.
              </p>
              <p className="mt-4">
                I don’t need grand gestures or fancy words to show how much you
                mean to me. It’s in the little moments—holding your hand,
                sharing late-night talks, and just being together— that I
                realize how lucky I am to have you.
              </p>
              <p className="mt-4">
                You’re my person, my peace, and my joy. And I wouldn’t trade
                this love for anything.
              </p>
              <div className="text-right text-xl mt-8">
                <p>Yours, always,</p>
                <p className="mt-8">[DayCream]</p>
              </div>
            </div>
          ) : (
            <div
              id="thaiContent"
              className="sriracha-regular leading-relaxed text-justify text-gray-800"
            >
              <p className="mb-4 text-xl">สุขสันต์วันวาเลนไทน์ที่รัก,</p>
              <p>
                ทุกวันกับคุณคือวันที่ฉันชื่นชอบที่สุด
                การมีคุณอยู่ในชีวิตทำให้โลกของฉันสดใสขึ้นอย่างไม่น่าเชื่อ
                ฉันรักในวิธีที่เราได้หัวเราะกับเรื่องเล็กน้อย
                วิธีที่เราเข้าใจกันโดยไม่ต้องเอ่ยคำใด
                และความสบายใจที่รู้ว่าคุณอยู่ข้างๆ เสมอ
              </p>
              <p className="mt-4">
                ฉันไม่ต้องการคำพูดหรูหราหรือท่าทีที่ยิ่งใหญ่เพื่อแสดงว่าคุณมีความหมายต่อฉันมากเพียงใด
                เพราะมันซ่อนอยู่ในช่วงเวลาเล็กๆ น้อยๆ — การได้จับมือคุณ
                การพูดคุยกันในยามดึก และการได้อยู่เคียงข้างกัน —
                สิ่งเหล่านี้ทำให้ฉันรู้ว่าฉันช่างโชคดีเพียงใดที่มีคุณในชีวิต
              </p>
              <p className="mt-4">
                คุณคือคนของฉัน คือความสงบสุข และความสุขของฉัน
                และฉันจะไม่มีวันแลกความรักนี้กับสิ่งใดในโลก
              </p>
              <div className="text-right text-xl mt-8">
                <p>ด้วยรักเสมอ,</p>
                <p className="mt-8">[เดย์ครีม]</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValentineMessage;

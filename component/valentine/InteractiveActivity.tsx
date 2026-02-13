import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useRef } from "react";

const InteractiveActivity = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [heartCount, setHeartCount] = useState(0);
  const [showSecretMessage, setShowSecretMessage] = useState(false);
  const [secretMessageText, setSecretMessageText] = useState<string>("");
  const [clickedHearts, setClickedHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noButtonHovered, setNoButtonHovered] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newCount = heartCount + 1;
    setHeartCount(newCount);
    setClickedHearts(prev => [...prev, { id: Date.now(), x, y }]);
    
    // Remove heart after animation
    setTimeout(() => {
      setClickedHearts(prev => prev.slice(1));
    }, 1000);

    // Change secret message text every time heart is clicked
    const randomMessage = secretMessages[Math.floor(Math.random() * secretMessages.length)];
    setSecretMessageText(randomMessage);

    // Show secret message after 10 clicks
    if (newCount === 10 && !showSecretMessage) {
      setTimeout(() => {
        setShowSecretMessage(true);
      }, 500);
    }
  };

  const secretMessages = [
    "เธอรู้ไหม... ทุกครั้งที่ได้มองตาเธอ ใจเต้นแรงเสมอ 💕",
    "วันนี้เป็นวันที่พิเศษ เพราะมีเธออยู่ข้างๆ ✨",
    "ขอบคุณที่ทำให้ทุกวันเป็นวันพิเศษ 🌟",
    "รักเธอมากกว่าที่จะบอกได้... 💖",
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 relative overflow-hidden"
    >
      <div className="relative z-10 max-w-4xl w-full mx-auto text-center">
        {/* Interactive Heart Counter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 sm:mb-10"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-rose-400"
            style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.3' }}
          >
            กดหัวใจเพื่อส่งความรัก 💕
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base sm:text-lg md:text-xl text-rose-300 mb-6 sm:mb-8"
            style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.8' }}
          >
            ลองกดหัวใจดูสิ... มีเซอร์ไพรซ์รออยู่! ✨
          </motion.p>

          <div className="relative inline-block">
            <motion.button
              onClick={handleHeartClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative text-6xl sm:text-7xl md:text-8xl cursor-pointer select-none"
              animate={inView ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              💖
            </motion.button>

            {/* Floating hearts on click */}
            <AnimatePresence>
              {clickedHearts.map((heart) => (
                <motion.div
                  key={heart.id}
                  initial={{ opacity: 1, scale: 0, x: heart.x, y: heart.y }}
                  animate={{ opacity: 0, scale: 1.5, y: heart.y - 100 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute text-3xl pointer-events-none"
                  style={{ left: heart.x, top: heart.y }}
                >
                  {['💕', '💖', '💗', '💝'][Math.floor(Math.random() * 4)]}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Heart Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView && heartCount > 0 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="mt-6 sm:mt-8"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-rose-400 font-bold">
              {heartCount} ครั้ง 💕
            </p>
            {heartCount >= 5 && heartCount < 10 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base sm:text-lg text-rose-300 mt-2"
              >
                เกือบถึงแล้ว! กดต่ออีกนิดนึง... ✨
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* Secret Message Reveal */}
        <AnimatePresence>
          {showSecretMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl mb-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-rose-400"
                  style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.3' }}
                >
                  เซอร์ไพรซ์! 🎉
                </h3>
                <p
                  className="text-base sm:text-lg md:text-xl text-rose-300 leading-relaxed"
                  style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.8' }}
                >
                  {secretMessageText}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Love Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl"
        >
          <h3
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-rose-400"
            style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.3' }}
          >
            คำถามเล็กๆ น้อยๆ 💭
          </h3>
          <p
            className="text-base sm:text-lg md:text-xl text-rose-300 leading-relaxed mb-4"
            style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.8' }}
          >
            วันนี้เป็นวันที่พิเศษสำหรับเธอไหม? ✨
          </p>
          <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center min-h-[80px]">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full font-bold text-base sm:text-lg shadow-lg z-10"
              onClick={() => alert('ยินดีด้วย! วันนี้เป็นวันที่พิเศษสำหรับเราทั้งคู่! 💕')}
            >
              ใช่! 💕
            </motion.button>
            <motion.button
              ref={noButtonRef}
              onMouseEnter={() => {
                if (!noButtonHovered) {
                  setNoButtonHovered(true);
                  const randomX = (Math.random() - 0.5) * 200;
                  const randomY = (Math.random() - 0.5) * 200;
                  setNoButtonPosition({ x: randomX, y: randomY });
                }
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  setNoButtonHovered(false);
                  setNoButtonPosition({ x: 0, y: 0 });
                }, 100);
              }}
              animate={{
                x: noButtonPosition.x,
                y: noButtonPosition.y,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-300 to-rose-300 text-white rounded-full font-bold text-base sm:text-lg shadow-lg z-10 relative"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                // วิ่งหนีเมื่อกด
                const randomX = (Math.random() - 0.5) * 300;
                const randomY = (Math.random() - 0.5) * 300;
                setNoButtonPosition({ x: randomX, y: randomY });
                
                // หลังจากวิ่งหนีแล้ว แสดงข้อความ
                setTimeout(() => {
                  alert('ไม่เป็นไร... ทุกวันที่มีเธอคือวันพิเศษเสมอ! ✨');
                  setNoButtonPosition({ x: 0, y: 0 });
                }, 500);
              }}
            >
              ยังไม่ใช่... 🤔
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default InteractiveActivity;


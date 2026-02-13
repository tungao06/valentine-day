import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

const PostcardButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const handleOpenPostcard = () => {
    router.push("/message");
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-gradient-to-br from-rose-100 via-pink-100 to-rose-50 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-rose-200 rounded-full opacity-20 blur-2xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 h-32 sm:w-40 sm:h-40 bg-pink-200 rounded-full opacity-20 blur-2xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl w-full px-3 sm:px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 bg-clip-text text-transparent leading-tight"
          style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.3', paddingTop: '0.2em', paddingBottom: '0.2em' }}
        >
          พร้อมแล้วหรือยัง?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-rose-300 mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2"
          style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.6', paddingTop: '0.1em', paddingBottom: '0.1em' }}
        >
          เปิดโพสต์การ์ดเพื่ออ่านข้อความพิเศษ
        </motion.p>

        <motion.button
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={handleOpenPostcard}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative px-6 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold rounded-full shadow-2xl overflow-hidden w-full sm:w-auto"
          style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.4' }}
        >
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 bg-white/20 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                }}
              />
            )}
          </AnimatePresence>
          <span className="relative z-10 flex items-center gap-3">
            <motion.span
              animate={isHovered ? { x: [0, 5, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              💌
            </motion.span>
            เปิดโพสต์การ์ด
            <motion.span
              animate={isHovered ? { x: [0, -5, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              💕
            </motion.span>
          </span>
        </motion.button>

        {/* Floating hearts */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 0, x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : i * 20 }}
              animate={{
                opacity: [0, 1, 0],
                y: -100,
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : i * 20,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
              className="absolute bottom-0 text-2xl"
            >
              ❤️
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PostcardButton;


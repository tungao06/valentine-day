import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useInView } from "react-intersection-observer";
import StorySection from "./StorySection";
import FinalSurprise from "./FinalSurprise";
import InteractiveActivity from "./InteractiveActivity";
import { storyImages } from "@utils/images";

interface StoryItem {
  id: number;
  title: string;
  description: string;
  images?: string[];
}

const LandingPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use intersection observer to detect when hero is in view
  const { ref: heroInViewRef, inView: heroInView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Scroll progress for hero section fade in/out
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Fade in-out based on scroll position (like PowerPoint slide)
  // Fade out when scrolling down past hero section
  // Fade in when scrolling back up to hero section
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [1, 0, 0, 1]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [1, 0.9, 0.9, 1]
  );

  // Story data with images from project folders - 5 romantic stories
  const storyItems: StoryItem[] = [
    {
      id: 1,
      title: "วันแรกที่เจอ",
      description: "จำได้ไหม... วันแรกที่พี่เจอเธอ ใจพี่เต้นแรงจนคิดว่าคนรอบข้างจะได้ยิน รอยยิ้มของเธอทำให้พี่ลืมทุกอย่างรอบตัว แค่ได้มองตาเธอ พี่ก็รู้แล้วว่าวันนี้คือจุดเริ่มต้นของเรื่องราวพิเศษที่เราจะสร้างด้วยกัน พี่อยากเก็บช่วงเวลานี้ไว้ในใจตลอดไป 💕",
      images: storyImages[0],
    },
    {
      id: 2,
      title: "ความทรงจำที่สวยงาม",
      description: "ทุกครั้งที่ได้อยู่ใกล้ๆ เธอ... พี่รู้สึกเหมือนอยู่ในโลกแห่งความฝัน ไม่ว่าจะเป็นการเดินจูงมือกัน การแชร์อาหารจานเดียวกัน หรือแค่การนั่งเงียบๆ ข้างกัน พี่ก็มีความสุขที่สุดแล้ว เธอทำให้ทุกวันธรรมดาของพี่กลายเป็นวันพิเศษ ✨",
      images: storyImages[1],
    },
    {
      id: 3,
      title: "ความรักที่เติบโต",
      description: "วันแล้ววันเล่า... ความรู้สึกของพี่ที่มีต่อเธอก็ลึกซึ้งขึ้นเรื่อยๆ เหมือนดอกไม้ที่ค่อยๆ บานสะพรั่งในใจพี่ ทุกครั้งที่ได้กอดเธอ พี่รู้สึกว่าตัวเองเป็นคนที่โชคดีที่สุดในโลกนี้ พี่รักเธอมากกว่าเมื่อวาน แต่จะรักเธอมากกว่าพรุ่งนี้เสมอ 🌹",
      images: storyImages[2],
    },
    {
      id: 4,
      title: "เธอคือทุกอย่าง",
      description: "เธอคือทุกอย่างที่พี่ต้องการ... เธอคือแสงแรกในยามเช้าที่ทำให้พี่อยากตื่นขึ้นมา เธอคือดวงดาวที่ส่องแสงในคืนมืด เธอคือแรงบันดาลใจที่ทำให้พี่อยากเป็นคนที่ดีขึ้นทุกวัน ไม่มีใครในโลกนี้ที่ทำให้ใจพี่เต้นแรงได้เท่าเธอ... และพี่จะรักเธอไปตลอดกาล 💖",
      images: storyImages[3],
    },
    {
      id: 5,
      title: "อนาคตของเรา",
      description: "พี่ฝันถึงอนาคตที่เราจะได้สร้างด้วยกัน... ฝันถึงการได้ตื่นมาพบรอยยิ้มของเธอทุกเช้า ฝันถึงการได้กอดเธอทุกคืนก่อนนอน ฝันถึงการได้เดินทางไปด้วยกันในทุกที่ที่เราอยากไป พี่สัญญาว่าจะอยู่ข้างๆ เธอเสมอ ไม่ว่าจะเกิดอะไรขึ้น... เพราะเธอคืออนาคตของพี่ 🌟",
      images: storyImages[4],
    },
  ];

  return (
    <div ref={containerRef} className="w-full min-h-screen">
      {/* Hero Section with Image Upload */}
      <motion.section
        ref={heroInViewRef}
        style={{ opacity, scale }}
        className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 opacity-80"></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-4xl w-full text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 bg-clip-text text-transparent px-2 sm:px-0"
            style={{ fontFamily: "'Tangerine', cursive" }}
          >
            Happy Valentine's Day
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-rose-300 mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2 sm:px-0"
            style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.6', paddingTop: '0.1em', paddingBottom: '0.1em' }}
          >
            เรื่องราวของเราที่อยากบอกเธอ...
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-rose-300 text-xs sm:text-sm flex flex-col items-center"
          >
            <span style={{ lineHeight: '1.5' }} className="px-2 text-center">เลื่อนลงเพื่อดูเรื่องราว</span>
            <svg
              className="w-6 h-6 mt-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Story Sections */}
      <div className="space-y-0">
        {storyItems.map((item, index) => (
          <StorySection
            key={item.id}
            item={item}
            index={index}
            totalItems={storyItems.length}
          />
        ))}
      </div>

      {/* Final Surprise Section */}
      <FinalSurprise />

      {/* Interactive Activity Section */}
      <InteractiveActivity />
    </div>
  );
};

export default LandingPage;


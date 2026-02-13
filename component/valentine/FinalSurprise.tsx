import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { getBlobUrl } from "@utils/blob";

const FinalSurprise = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // รูปภาพที่สวยที่สุดจากทุก story (เลือกมา 6-9 รูป)
  const favoriteImages = [
    "/story1/story1_image1.jpg",
    "/story1/story1_image2.jpg",
    "/story2/story2_image1.jpg",
    "/story2/story2_image2.jpg",
    "/story3/story3_image1.jpg",
    "/story3/story3_image2.jpg",
    "/story4/story4_image1.jpg",
    "/story4/story4_image2.jpg",
    "/story5/story5_image1.jpg",
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 bg-gradient-to-br from-rose-100 via-pink-100 to-rose-50 relative overflow-hidden"
    >
      {/* Decorative floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 0, x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : i * 10 }}
            animate={inView ? {
              opacity: [0, 1, 0],
              y: -window.innerHeight,
              x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : i * 10,
            } : {}}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut",
            }}
            className="absolute bottom-0 text-2xl sm:text-3xl"
            style={{ left: `${(i * 10) % 100}%` }}
          >
            {['💕', '💖', '💗', '💝', '❤️'][i % 5]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl w-full mx-auto text-center">
        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 bg-clip-text text-transparent leading-tight px-2 sm:px-0"
            style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.3', paddingTop: '0.2em', paddingBottom: '0.2em' }}
          >
            ขอบคุณที่เข้ามาในชีวิตนี้
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-rose-300 leading-relaxed px-2 sm:px-0 mb-6 sm:mb-8"
            style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.8', paddingTop: '0.1em', paddingBottom: '0.1em' }}
          >
            ทุกช่วงเวลาที่ได้อยู่ด้วยกัน... เก็บไว้ในใจเสมอ
            <br />
            ไม่ว่าจะเป็นวันที่ดีหรือวันที่เหนื่อย
            <br />
            รู้ว่ามีเธออยู่ข้างๆ เสมอ
            <br />
            <br />
            รักเธอมากกว่าเมื่อวาน
            <br />
            แต่จะรักเธอน้อยกว่าพรุ่งนี้เสมอ 💕
          </motion.p>
        </motion.div>

        {/* Photo Collage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 sm:mb-10"
        >
          <h3
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-rose-400"
            style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.3' }}
          >
            ความทรงจำที่เก็บไว้ 💖
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {favoriteImages.map((image, index) => {
              // Use Vercel Blob URL if configured, otherwise use local path with encoding
              const blobUrl = getBlobUrl(image);
              const pathParts = image.split('/');
              const filename = pathParts.pop() || '';
              const encodedFilename = encodeURIComponent(filename);
              const encodedImage = [...pathParts, encodedFilename].join('/');
              // Use blob URL if available, otherwise use encoded path
              const finalImageUrl = blobUrl !== image ? blobUrl : encodedImage;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.5,
                    delay: 1 + (index * 0.1),
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg group cursor-pointer"
                  onClick={() => setSelectedImage(selectedImage === index ? null : index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="aspect-square bg-gradient-to-br from-rose-100/50 to-pink-100/50 flex items-center justify-center">
                    <img
                      src={finalImageUrl}
                      alt={`Memory ${index + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Final Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl"
        >
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 1.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-rose-400"
            style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.3' }}
          >
            คำสัญญา 🌟
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base sm:text-lg md:text-xl text-rose-300 leading-relaxed"
            style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.8' }}
          >
            สัญญาว่าจะรักเธอไปตลอดกาล
            <br />
            จะอยู่ข้างๆ เธอในทุกช่วงเวลาของชีวิต
            <br />
            จะทำให้เธอยิ้มได้ทุกวัน
            <br />
            และจะสร้างความสุขให้เธอเสมอ
            <br />
            <br />
            <span className="text-rose-400 font-bold text-lg sm:text-xl md:text-2xl">
              เพราะเธอคือทุกอย่าง...  💕น้องเดย์ครีม💕
            </span>
          </motion.p>
        </motion.div>

        {/* Click to view full image modal */}
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            className="max-w-4xl w-full"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
              <img
                src={favoriteImages[selectedImage] ? getBlobUrl(favoriteImages[selectedImage]) : ''}
                alt={`Memory ${selectedImage + 1}`}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default FinalSurprise;


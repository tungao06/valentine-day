import { useState, useRef, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

interface LazyVideoProps {
  src: string;
  alt: string;
  className?: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  onLoadedMetadata?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
}

const LazyVideo = ({
  src,
  alt,
  className = "",
  poster,
  autoplay = true,
  loop = true,
  muted = true,
  playsInline = true,
  onLoadedMetadata,
}: LazyVideoProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Encode URI to handle special characters in filenames
  const pathParts = src.split('/');
  const filename = pathParts.pop() || '';
  const encodedFilename = encodeURIComponent(filename);
  const encodedSrc = [...pathParts, encodedFilename].join('/');
  
  // Also try original path and alternative encoding
  const originalSrc = src;
  const alternativeSrc = src.split('/').map(part => encodeURIComponent(part)).join('/');
  
  // State to track current src being tried
  const [currentSrc, setCurrentSrc] = useState(encodedSrc);

  useEffect(() => {
    if (inView && !shouldLoad) {
      // Delay loading slightly for smoother scrolling
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView, shouldLoad]);

  // Shared error handling logic
  const tryAlternativeSource = useCallback(() => {
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
    
    setIsLoading(false);
    
    // Log detailed error information for debugging
    const videoElement = videoRef.current;
    if (videoElement) {
      const error = videoElement.error;
      if (error) {
        let errorMessage = 'Unknown error';
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = 'Video loading aborted';
            break;
          case error.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error - file may not exist (404)';
            break;
          case error.MEDIA_ERR_DECODE:
            errorMessage = 'Video decode error';
            break;
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Video format not supported';
            break;
        }
        console.error('Video error:', {
          code: error.code,
          message: errorMessage,
          src: currentSrc,
          originalSrc: src,
          videoElementSrc: videoElement.src
        });
      }
    }
    
    // Try alternative encoding if current one failed
    if (currentSrc === encodedSrc) {
      setCurrentSrc(alternativeSrc);
      setIsLoading(true);
      setHasError(false);
      if (videoRef.current) {
        videoRef.current.src = alternativeSrc;
        videoRef.current.load();
      }
    } else if (currentSrc === alternativeSrc) {
      setCurrentSrc(originalSrc);
      setIsLoading(true);
      setHasError(false);
      if (videoRef.current) {
        videoRef.current.src = originalSrc;
        videoRef.current.load();
      }
    } else {
      setHasError(true);
      console.error('Video failed to load after trying all encoding methods:', {
        originalSrc: src,
        triedUrls: [encodedSrc, alternativeSrc, originalSrc]
      });
    }
  }, [currentSrc, encodedSrc, alternativeSrc, originalSrc, src, loadTimeout]);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    tryAlternativeSource();
  }, [tryAlternativeSource]);

  // Set timeout for video loading
  useEffect(() => {
    if (shouldLoad && videoRef.current && isLoading && !hasError) {
      const timeout = setTimeout(() => {
        if (videoRef.current && isLoading && !hasError) {
          console.warn('Video loading timeout, trying alternative path...');
          tryAlternativeSource();
        }
      }, 10000); // 10 seconds timeout
      
      setLoadTimeout(timeout);
      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [shouldLoad, isLoading, hasError, tryAlternativeSource]);

  useEffect(() => {
    if (videoRef.current && shouldLoad) {
      if (inView && autoplay) {
        videoRef.current.play().catch(() => {
          // Auto-play failed, user interaction required
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else if (!inView) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [inView, shouldLoad, autoplay]);

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing video:', error);
        setHasError(true);
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVideoLoaded = () => {
    setIsLoading(false);
    setHasError(false);
    if (loadTimeout) {
      clearTimeout(loadTimeout);
      setLoadTimeout(null);
    }
  };

  return (
    <div ref={ref} className="relative w-full h-full">
      {!shouldLoad ? (
        // Placeholder while not in view - prevents layout shift
        <div className={`${className} bg-gradient-to-br from-rose-100/50 to-pink-100/50 flex items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px] rounded-xl sm:rounded-2xl`}>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-rose-300 text-sm"
          >
            📹
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full group"
        >
          <video
            ref={videoRef}
            src={currentSrc}
            poster={poster ? (() => {
              const posterParts = poster.split('/');
              const posterFilename = posterParts.pop() || '';
              return [...posterParts, encodeURIComponent(posterFilename)].join('/');
            })() : undefined}
            loop={loop}
            muted={muted}
            playsInline={playsInline}
            preload="metadata"
            className={`${className} object-contain w-full h-auto rounded-2xl sm:rounded-3xl`}
            onLoadedMetadata={(e) => {
              handleVideoLoaded();
              if (onLoadedMetadata) {
                onLoadedMetadata(e);
              }
            }}
            onCanPlay={() => {
              handleVideoLoaded();
            }}
            onLoadedData={() => {
              handleVideoLoaded();
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleVideoError}
          />
          {/* Loading indicator */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-rose-300 border-t-rose-500 rounded-full"
              />
            </div>
          )}
          {/* Error message */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-rose-100/50 rounded-2xl sm:rounded-3xl">
              <div className="text-center p-4 max-w-md">
                <p className="text-rose-400 text-sm mb-2">
                  ไม่สามารถโหลดวิดีโอได้
                  {src.toLowerCase().endsWith('.mov') && (
                    <span className="block mt-1 text-xs">
                      (ไฟล์ .mov อาจไม่รองรับในบาง browser)
                    </span>
                  )}
                  {currentSrc.includes('vercel-storage.com') && (
                    <span className="block mt-2 text-xs text-rose-500">
                      ⚠️ ตรวจสอบว่าไฟล์อยู่ใน Blob Storage ที่ path ที่ถูกต้อง
                      <br />
                      ดูคู่มือใน BLOB_STORAGE_SETUP.md
                    </span>
                  )}
                </p>
                <div className="text-xs text-rose-300 mb-3 break-all">
                  URL: {currentSrc}
                </div>
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    setCurrentSrc(encodedSrc); // Reset to first encoding
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="px-4 py-2 bg-rose-400 text-white rounded-full text-sm hover:bg-rose-500 transition-colors"
                >
                  ลองอีกครั้ง
                </button>
              </div>
            </div>
          )}
          {/* Play/Pause overlay */}
          {!isPlaying && !isLoading && !hasError && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer group-hover:bg-black/30 transition-colors rounded-2xl sm:rounded-3xl"
              onClick={handlePlay}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg
                  className="w-8 h-8 text-rose-500 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LazyVideo;


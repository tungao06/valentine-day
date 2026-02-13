import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import LazyVideo from "./LazyVideo";
import { isVideo } from "@utils/images";
import { getBlobUrl } from "@utils/blob";

interface StoryItem {
  id: number;
  title: string;
  description: string;
  images?: string[];
}

interface StorySectionProps {
  item: StoryItem;
  index: number;
  totalItems: number;
}

const StorySection = ({ item, index, totalItems }: StorySectionProps) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false, // Allow re-triggering when scrolling up
    rootMargin: '100px',
  });

  const isEven = index % 2 === 0;
  const [imageOrientations, setImageOrientations] = useState<{ [key: number]: 'landscape' | 'portrait' | 'unknown' }>({});
  const [imageAspectRatios, setImageAspectRatios] = useState<{ [key: number]: number }>({});
  const imageRefs = useRef<{ [key: number]: HTMLImageElement | null }>({});
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const loadedImages = useRef<Set<number>>(new Set());
  const loadedVideos = useRef<Set<number>>(new Set());
  const isStory1 = item.id === 1;
  const isStory2 = item.id === 2;
  const isStory3 = item.id === 3;
  const isStory4 = item.id === 4;
  const isStory5 = item.id === 5;
  const isStory4Or5 = isStory4 || isStory5;
  
  // Check if image should be displayed full frame
  const shouldDisplayFullFrame = useCallback((mediaIndex: number) => {
    // Story 1: image 2 (index 1)
    if (isStory1 && mediaIndex === 1) return true;
    // Story 2: image 1 (index 0)
    if (isStory2 && mediaIndex === 0) return true;
    // Story 3: image 2 (index 1)
    if (isStory3 && mediaIndex === 1) return true;
    // Story 4 or 5: image 1 (index 0)
    if (isStory4Or5 && mediaIndex === 0) return true;
    return false;
  }, [isStory1, isStory2, isStory3, isStory4Or5]);

  // Function to check image orientation after load
  const handleImageLoad = useCallback((index: number, img: HTMLImageElement) => {
    // Prevent infinite loop by checking if already loaded
    if (loadedImages.current.has(index)) {
      return;
    }

    // Check if image is actually loaded
    if (!img.naturalWidth || !img.naturalHeight) {
      return;
    }

    const aspectRatio = img.naturalWidth / img.naturalHeight;
    const orientation = aspectRatio > 1 ? 'landscape' : 'portrait';
    
    // Mark as loaded first to prevent re-triggering
    loadedImages.current.add(index);
    
    // Only update if orientation is different from current state
    setImageOrientations(prev => {
      // Check if orientation already exists and is the same
      if (prev[index] === orientation) {
        return prev; // No change, return same object to prevent re-render
      }
      return { ...prev, [index]: orientation };
    });

    // Store aspect ratio for all images
    setImageAspectRatios(prev => {
      // Check if aspect ratio already exists and is the same
      if (prev[index] === aspectRatio) {
        return prev; // No change, return same object to prevent re-render
      }
      return { ...prev, [index]: aspectRatio };
    });
  }, []);

  // Function to check video orientation after load
  const handleVideoLoad = useCallback((index: number, video: HTMLVideoElement) => {
    // Prevent infinite loop by checking if already loaded
    if (loadedVideos.current.has(index)) {
      return;
    }

    // Check if video is actually loaded
    if (!video.videoWidth || !video.videoHeight) {
      return;
    }

    const aspectRatio = video.videoWidth / video.videoHeight;
    const orientation = aspectRatio > 1 ? 'landscape' : 'portrait';
    
    // Mark as loaded first to prevent re-triggering
    loadedVideos.current.add(index);
    
    // Only update if orientation is different from current state
    setImageOrientations(prev => {
      // Check if orientation already exists and is the same
      if (prev[index] === orientation) {
        return prev; // No change, return same object to prevent re-render
      }
      return { ...prev, [index]: orientation };
    });

    // Store aspect ratio for all videos
    setImageAspectRatios(prev => {
      // Check if aspect ratio already exists and is the same
      if (prev[index] === aspectRatio) {
        return prev; // No change, return same object to prevent re-render
      }
      return { ...prev, [index]: aspectRatio };
    });
  }, []);

  // Separate images and videos by orientation using useMemo to prevent unnecessary recalculations
  const { portraitImages, landscapeImages } = useMemo(() => {
    const portrait: Array<{ media: string; index: number; isVideo: boolean }> = [];
    const landscape: Array<{ media: string; index: number; isVideo: boolean }> = [];

    item.images?.forEach((media, mediaIndex) => {
      const isVideoFile = isVideo(media);
      const orientation = imageOrientations[mediaIndex] || 'unknown';
      
      if (orientation === 'portrait') {
        portrait.push({ media, index: mediaIndex, isVideo: isVideoFile });
      } else if (orientation === 'landscape') {
        landscape.push({ media, index: mediaIndex, isVideo: isVideoFile });
      } else {
        // Default to portrait if unknown
        portrait.push({ media, index: mediaIndex, isVideo: isVideoFile });
      }
    });

    return { portraitImages: portrait, landscapeImages: landscape };
  }, [item.images, imageOrientations]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.1,
      }}
      className={`min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 ${
        isEven ? "bg-gradient-to-br from-pink-50 to-rose-50" : "bg-gradient-to-br from-rose-50 to-pink-50"
      }`}
    >
      <div className={`max-w-6xl w-full mx-auto ${isStory1 || isStory2 || isStory3 || isStory4Or5 ? 'flex items-center justify-center' : ''}`}>
        <div
          className={`flex flex-col ${
            isEven ? "md:flex-row" : "md:flex-row-reverse"
          } items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 ${isStory1 || isStory2 || isStory3 || isStory4Or5 ? 'justify-center' : ''}`}
        >
          {/* Image Gallery Section */}
          {item.images && item.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="flex-1 w-full"
            >
              <div className="relative flex flex-col gap-4 sm:gap-5 md:gap-6">
                {/* Portrait images - displayed in pairs at the top */}
                {portraitImages.length > 0 && (
                  <div className={`grid gap-4 sm:gap-5 md:gap-6 items-center justify-items-center ${
                    portraitImages.length === 1 
                      ? 'grid-cols-1' 
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}>
                    {portraitImages.map(({ media, index: mediaIndex, isVideo: isVideoFile }, mapIndex) => {
                      // Use Vercel Blob URL if configured, otherwise use local path with encoding
                      const blobUrl = getBlobUrl(media);
                      const pathParts = media.split('/');
                      const filename = pathParts.pop() || '';
                      const encodedFilename = encodeURIComponent(filename);
                      const encodedMedia = [...pathParts, encodedFilename].join('/');
                      // Use blob URL if available, otherwise use encoded path
                      const finalMediaUrl = blobUrl !== media ? blobUrl : encodedMedia;
                      const isFullFrameImage = shouldDisplayFullFrame(mediaIndex) && (
                        (isStory1 && mediaIndex === 1 && item.images?.[1] === media) ||
                        (isStory2 && mediaIndex === 0 && item.images?.[0] === media) ||
                        (isStory3 && mediaIndex === 1 && item.images?.[1] === media) ||
                        (isStory4Or5 && mediaIndex === 0 && item.images?.[0] === media)
                      );
                      const aspectRatio = imageAspectRatios[mediaIndex];
                      return (
                        <motion.div
                          key={`portrait-${mediaIndex}`}
                          initial={{ opacity: 0, y: 30, x: isEven ? -30 : 30 }}
                          animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 30, x: isEven ? -30 : 30 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: 0.1 + (mediaIndex * 0.05),
                            ease: [0.25, 0.1, 0.25, 1]
                          }}
                          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group flex justify-center items-center`}
                          style={{
                            ...(aspectRatio ? {
                              width: '100%',
                              maxWidth: '100%',
                              aspectRatio: aspectRatio.toString()
                            } : {}),
                            willChange: 'transform, opacity'
                          }}
                        >
                          <div className={`w-full h-full flex items-center justify-center ${isFullFrameImage ? '' : 'bg-gradient-to-br from-rose-100/50 to-pink-100/50'}`}>
                            {isVideoFile ? (
                              <LazyVideo
                                src={finalMediaUrl}
                                alt={`${item.title} - Video ${mediaIndex + 1}`}
                                className={`w-full h-full object-contain rounded-2xl sm:rounded-3xl`}
                                autoplay={true}
                                loop={true}
                                muted={true}
                                playsInline={true}
                                onLoadedMetadata={(e) => {
                                  const target = e.target as HTMLVideoElement;
                                  handleVideoLoad(mediaIndex, target);
                                }}
                              />
                            ) : (
                              <img
                                ref={(el) => {
                                  if (el) {
                                    imageRefs.current[mediaIndex] = el;
                                    if (el.complete) {
                                      handleImageLoad(mediaIndex, el);
                                    }
                                  }
                                }}
                                src={finalMediaUrl}
                                alt={`${item.title} - ${mediaIndex + 1}`}
                                loading="lazy"
                                className={`w-full h-full object-contain rounded-2xl sm:rounded-3xl group-hover:scale-105 transition-transform duration-500 ${isFullFrameImage ? '' : 'shadow-lg'}`}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  handleImageLoad(mediaIndex, target);
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.error('Failed to load image:', media, 'URL:', finalMediaUrl);
                                  
                                  if (media.toUpperCase().endsWith('.HEIC')) {
                                    target.style.display = 'none';
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-rose-100 text-rose-400 text-sm p-4 text-center';
                                    errorDiv.textContent = 'HEIC format ไม่รองรับ กรุณาแปลงเป็น JPG หรือ PNG';
                                    target.parentElement?.appendChild(errorDiv);
                                    return;
                                  }
                                  
                                  const altEncoded = media.split('/').map(part => encodeURIComponent(part)).join('/');
                                  if (target.src !== altEncoded && target.src !== window.location.origin + altEncoded) {
                                    target.src = altEncoded;
                                  } else {
                                    target.style.display = 'none';
                                  }
                                }}
                              />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Landscape images - displayed larger at the bottom */}
                {landscapeImages.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 items-center justify-items-center">
                    {landscapeImages.map(({ media, index: mediaIndex, isVideo: isVideoFile }, mapIndex) => {
                      // Use Vercel Blob URL if configured, otherwise use local path with encoding
                      const blobUrl = getBlobUrl(media);
                      const pathParts = media.split('/');
                      const filename = pathParts.pop() || '';
                      const encodedFilename = encodeURIComponent(filename);
                      const encodedMedia = [...pathParts, encodedFilename].join('/');
                      // Use blob URL if available, otherwise use encoded path
                      const finalMediaUrl = blobUrl !== media ? blobUrl : encodedMedia;
                      const isFullFrameImage = shouldDisplayFullFrame(mediaIndex) && (
                        (isStory1 && mediaIndex === 1 && item.images?.[1] === media) ||
                        (isStory2 && mediaIndex === 0 && item.images?.[0] === media) ||
                        (isStory3 && mediaIndex === 1 && item.images?.[1] === media) ||
                        (isStory4Or5 && mediaIndex === 0 && item.images?.[0] === media)
                      );
                      const aspectRatio = imageAspectRatios[mediaIndex];
                      return (
                        <motion.div
                          key={`landscape-${mediaIndex}`}
                          initial={{ opacity: 0, y: 30, x: isEven ? -30 : 30 }}
                          animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: 30, x: isEven ? -30 : 30 }}
                          transition={{ 
                            duration: 0.6, 
                            delay: 0.1 + (mediaIndex * 0.05),
                            ease: [0.25, 0.1, 0.25, 1]
                          }}
                          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl group flex justify-center items-center`}
                          style={{
                            ...(aspectRatio ? {
                              width: '100%',
                              maxWidth: '100%',
                              aspectRatio: aspectRatio.toString()
                            } : {}),
                            willChange: 'transform, opacity'
                          }}
                        >
                          <div className={`w-full h-full flex items-center justify-center ${isFullFrameImage ? '' : 'bg-gradient-to-br from-rose-100/50 to-pink-100/50'}`}>
                            {isVideoFile ? (
                              <LazyVideo
                                src={finalMediaUrl}
                                alt={`${item.title} - Video ${mediaIndex + 1}`}
                                className={`w-full h-full object-contain rounded-2xl sm:rounded-3xl`}
                                autoplay={true}
                                loop={true}
                                muted={true}
                                playsInline={true}
                                onLoadedMetadata={(e) => {
                                  const target = e.target as HTMLVideoElement;
                                  handleVideoLoad(mediaIndex, target);
                                }}
                              />
                            ) : (
                              <img
                                ref={(el) => {
                                  if (el) {
                                    imageRefs.current[mediaIndex] = el;
                                    if (el.complete) {
                                      handleImageLoad(mediaIndex, el);
                                    }
                                  }
                                }}
                                src={finalMediaUrl}
                                alt={`${item.title} - ${mediaIndex + 1}`}
                                loading="lazy"
                                className={`w-full h-full object-contain rounded-2xl sm:rounded-3xl group-hover:scale-105 transition-transform duration-500 ${isFullFrameImage ? '' : 'shadow-lg'}`}
                                onLoad={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  handleImageLoad(mediaIndex, target);
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  console.error('Failed to load image:', media, 'URL:', finalMediaUrl);
                                  
                                  if (media.toUpperCase().endsWith('.HEIC')) {
                                    target.style.display = 'none';
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'absolute inset-0 flex items-center justify-center bg-rose-100 text-rose-400 text-sm p-4 text-center';
                                    errorDiv.textContent = 'HEIC format ไม่รองรับ กรุณาแปลงเป็น JPG หรือ PNG';
                                    target.parentElement?.appendChild(errorDiv);
                                    return;
                                  }
                                  
                                  const altEncoded = media.split('/').map(part => encodeURIComponent(part)).join('/');
                                  if (target.src !== altEncoded && target.src !== window.location.origin + altEncoded) {
                                    target.src = altEncoded;
                                  } else {
                                    target.style.display = 'none';
                                  }
                                }}
                              />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 50 : -50 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="flex-1 text-center md:text-left w-full"
          >
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 text-rose-400 leading-tight px-2 sm:px-0"
              style={{ fontFamily: "'Sriracha', cursive", lineHeight: '1.3', paddingTop: '0.2em', paddingBottom: '0.2em' }}
            >
              {item.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-base sm:text-lg md:text-xl text-rose-300 leading-relaxed px-2 sm:px-0"
              style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.8', paddingTop: '0.1em', paddingBottom: '0.1em' }}
            >
              {item.description}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default StorySection;


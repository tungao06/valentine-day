import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface ImageUploadProps {
  onImagesUploaded: (images: string[]) => void;
}

const ImageUpload = ({ onImagesUploaded }: ImageUploadProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      alert("กรุณาเลือกรูปภาพเท่านั้น");
      return;
    }

    const imagePromises = imageFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((imageUrls) => {
      const newImages = [...images, ...imageUrls].slice(0, 3); // Limit to 3 images
      setImages(newImages);
      onImagesUploaded(newImages);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 cursor-pointer
          transition-all duration-300
          ${
            isDragging
              ? "border-rose-400 bg-rose-50"
              : "border-rose-200 bg-white/50 hover:border-rose-300 hover:bg-rose-50/50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {images.length === 0 ? (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-4"
            >
              <svg
                className="w-16 h-16 mx-auto text-rose-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </motion.div>
            <p className="text-rose-400 text-lg mb-2 leading-relaxed" style={{ fontFamily: "'Thasadith', sans-serif", lineHeight: '1.6', paddingTop: '0.1em', paddingBottom: '0.1em' }}>
              คลิกหรือลากรูปภาพมาวางที่นี่
            </p>
            <p className="text-rose-300 text-sm leading-relaxed" style={{ lineHeight: '1.5', paddingTop: '0.1em', paddingBottom: '0.1em' }}>
              อัปโหลดรูปภาพของเรา (สูงสุด 3 รูป)
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </motion.div>
            ))}
            {images.length < 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-2 border-dashed border-rose-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-rose-300 transition-colors"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <span className="text-rose-300 text-2xl">+</span>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ImageUpload;


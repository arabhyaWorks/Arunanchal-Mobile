import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { TranslatableText } from './TranslatableText';

interface ImageModalProps {
  images: Array<{
    id: number;
    file_path: string;
    title: string;
    description: string;
  }>;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious
}) => {
  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {currentIndex > 0 && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Image container */}
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="relative max-w-5xl w-full">
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={3}
            wheel={{ step: 0.1 }}
            pinch={{ step: 0.1 }}
          >
            <TransformComponent>
              <img
                src={currentImage.file_path}
                alt={currentImage.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
            </TransformComponent>
          </TransformWrapper>
          
          {/* Image info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
            <h3 className="text-white text-lg font-medium mb-1">
              <TranslatableText text={currentImage.title} />
            </h3>
            <p className="text-white/80 text-sm">
              <TranslatableText text={currentImage.description} />
            </p>
          </div>
        </div>

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
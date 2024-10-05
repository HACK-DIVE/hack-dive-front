export const ImageModal = ({ src, alt, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="max-h-[90%] max-w-[90%]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[70vh] max-w-full object-contain"
        />
        <button
          className="absolute right-4 top-4 text-2xl text-white hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

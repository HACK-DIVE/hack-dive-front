import Image from "next/image";
import { useState } from "react";
import { ImageModal } from "../modal/ImageModal";

export default function GenImage({ src, alt, onClick }) {
  const [isOpen, setIsModalOpen] = useState(false);
  const onClickHandler = () => {
    setIsModalOpen(!isOpen);
  };
  return (
    <>
      <Image
        className="h-full w-full cursor-pointer object-cover hover:brightness-75"
        src={src}
        width={148}
        height={144}
        onClick={onClickHandler}
        alt={alt}
      ></Image>
      <ImageModal
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

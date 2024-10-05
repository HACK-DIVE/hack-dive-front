import Image from "next/image";
import { useEffect, useState } from "react";
import GenImage from "../buttons/GenImage";
import AiDialog from "./AiDialog";

export default function AIImages() {
  const [isLoading, setIsLoading] = useState(true);
  const data = {
    role: "assistant",
    content: "마음에 드는 이미지를 선택해주세요",
  };

  useEffect(() => {
    // 5초 후 로딩 완료
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 5초 후에 로딩 완료

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  return (
    <>
      <AiDialog data={data} isLoading={isLoading} />
      {isLoading ? (
        <></>
      ) : (
        <div className="my-11 grid max-w-[320px] grid-cols-2 gap-1 overflow-hidden rounded-3xl">
          <GenImage src={"/stool_1.png"} alt={1}></GenImage>
          <GenImage src={"/stool_2.png"} alt={2}></GenImage>
          <GenImage src={"/stool_3.png"} alt={3}></GenImage>
          <GenImage src={"/stool_4.png"} alt={4}></GenImage>
        </div>
      )}
    </>
  );
}

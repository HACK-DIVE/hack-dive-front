"use client";

import { useEffect, useState } from "react";
import { postWorkSpace } from "@/services/messages";

import ChatBot from "@/components/chat/ChatBot";

export default function Home() {
  const [workSpaceId, setWorkSpaceId] = useState(null); // null로 초기화
  const [isFirst, setIsFirst] = useState(1); // isFirst 상태를 부모로 이동
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state
  const fetchWorkSpaceId = async () => {
    if (workSpaceId !== null) return;

    try {
      const res = await postWorkSpace();
      if (res.status === 200) {
        setWorkSpaceId(res.data);
        setLoading(false); // Stop loading
      } else {
        throw new Error("Failed to get workspace ID");
      }
    } catch (err) {
      console.error("refresh error", err);
      setError("Failed to load workspace. Please try again.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWorkSpaceId();
  }, []);

  if (loading) return <div className="bg-white">adasd</div>;
  if (error) return <p>{error}</p>;
  return (
    <>
      {workSpaceId === null ? ( // null 체크
        <p>Loading workspace...</p>
      ) : (
        <ChatBot
          spaceId={workSpaceId}
          isFirst={isFirst}
          setIsFirst={setIsFirst}
        />
      )}
    </>
  );

  //   const [isOpenChatBot, setOpenChatBot] = useState(false);
  //   const [workSpaceId, setWorkSpaceId] = useState(0);
  //   const [isFirst, setIsFirst] = useState(1); // isFirst 상태를 부모로 이동

  //   const onWorkSpaceId = async () => {
  //     if (workSpaceId !== 0) return; // 이미 workSpaceId가 설정되었으면 더 이상 요청하지 않음

  //     try {
  //       const res = await postWorkSpace();
  //       setWorkSpaceId(res.data);

  //       if (res.status !== 200) {
  //         throw new Error();
  //       }
  //     } catch (err) {
  //       console.error("refresh error");
  //     }
  //   };

  //   useEffect(() => {
  //     // 비동기 IIFE를 사용하여 컴포넌트 마운트 시 workSpaceId 설정
  //     onWorkSpaceId();
  //   }, []);

  //   const onClickChatbotHandler = () => {
  //     if (workSpaceId !== 0) {
  //       setOpenChatBot(!isOpenChatBot);
  //     }
  //   };

  //   console.log(isOpenChatBot);
  //   return (
  //     <div className="flex h-screen w-screen overflow-hidden">
  //       <div
  //         className="relative grow transition-all duration-500 ease-in-out"
  //         style={{ width: isOpenChatBot ? "calc(100% - 484px)" : "100%" }}
  //       >
  //         <div className="size-full">
  //           <video
  //             src="video.mp4"
  //             className="size-full object-cover"
  //             controls
  //             loop
  //             muted
  //           ></video>
  //         </div>
  //         <div
  //           className="absolute z-10 size-fit cursor-pointer rounded-[12px] bg-gradient-to-tl from-[#0C3E8D] to-[#010204] px-4 py-2 text-white transition-all duration-500 ease-in-out hover:brightness-75"
  //           style={{
  //             right: "1rem",
  //             top: "10rem",
  //           }}
  //           onClick={onClickChatbotHandler}
  //         >
  //           <ChatSVG></ChatSVG>
  //         </div>
  //       </div>

  //       <div
  //         className={`h-full bg-slate-50 transition-all duration-500 ease-in-out ${
  //           isOpenChatBot ? "w-[484px]" : "w-0"
  //         }`}
  //       >
  //         <div className="h-full">
  //           {isOpenChatBot && (
  //             <ChatBot
  //               spaceId={workSpaceId}
  //               isFirst={isFirst}
  //               setIsFirst={setIsFirst}
  //             />
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   );
}

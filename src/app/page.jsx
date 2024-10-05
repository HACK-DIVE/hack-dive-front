"use client";
import Logo from "@/images/logo/ansys_chatbot_logo.svg";
import PoweredByLogo from "@/images/logo/poweredby_logo.svg";
import Send from "@/images/icon/send.svg";
import AiDialog from "@/components/message/AiDialog";
import UserDialog from "@/components/message/UserDialog";
import { useEffect, useRef, useState } from "react";
import {
  getHealthCheck,
  getHistory,
  postAIMessageUrl,
  postMessage,
  postWorkSpace,
} from "@/services/messages";
import Button from "@/components/buttons/Button";
import AIImages from "@/components/message/AIImages";
import ChatBot from "@/components/chat/ChatBot";
import ChatSVG from "@/images/icon/ansysChat.svg";

export default function Home() {
  const [isOpenChatBot, setOpenChatBot] = useState(false);
  const [workSpaceId, setWorkSpaceId] = useState(0);
  const onWorkSpaceId = async () => {
    if (workSpaceId !== 0) return; // 이미 workSpaceId가 설정되었으면 더 이상 요청하지 않음

    try {
      const res = await postWorkSpace();
      setWorkSpaceId(res.data);

      if (res.status !== 200) {
        throw new Error();
      }
    } catch (err) {
      console.error("refresh error");
    }
  };

  useEffect(() => {
    // 비동기 IIFE를 사용하여 컴포넌트 마운트 시 workSpaceId 설정
    (async () => {
      await onWorkSpaceId();
    })();
  }, []);

  const onClickChatbotHandler = () => {
    if (workSpaceId !== 0) {
      setOpenChatBot(!isOpenChatBot);
    }
  };

  console.log(isOpenChatBot);
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div
        className="relative flex-grow transition-all duration-500 ease-in-out"
        style={{ width: isOpenChatBot ? "calc(100% - 484px)" : "100%" }}
      >
        <div className="h-full w-full">
          <video
            src="video.mp4"
            className="h-full w-full object-cover"
            controls
            loop
            muted
          ></video>
        </div>
        <div
          className="absolute z-10 h-fit w-fit cursor-pointer rounded-[12px] bg-gradient-to-tl from-[#0C3E8D] to-[#010204] px-4 py-2 text-white transition-all duration-500 ease-in-out hover:brightness-75"
          style={{
            right: "1rem",
            top: "10rem",
          }}
          onClick={onClickChatbotHandler}
        >
          <ChatSVG></ChatSVG>
        </div>
      </div>

      <div
        className={`h-full bg-slate-50 transition-all duration-500 ease-in-out ${
          isOpenChatBot ? "w-[484px]" : "w-0"
        }`}
      >
        <div className="h-full">
          {isOpenChatBot && <ChatBot spaceId={workSpaceId} />}
        </div>
      </div>
    </div>
  );
}

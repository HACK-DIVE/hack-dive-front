"use client";
import Logo from "@/images/logo/ansys_chatbot_logo.svg";
import PoweredByLogo from "@/images/logo/poweredby_logo.svg";
import Send from "@/images/icon/send.svg";
import AiDialog from "@/components/message/AiDialog";
import UserDialog from "@/components/message/UserDialog";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/messages");
      setMessages(res.data);
    } catch (error) {
      console.error("error fetching data", error);
    }
  };

  const handleSubmitMsg = async (e) => {
    e.preventDefault();

    try {
      const newMessage = { id: 1, image: null, name: "user", message: input };
      const newAiMessage = {
        id: 2,
        image: null,
        name: "assistant",
        message: "테스트 메세지입니다 저는 당신의 도우미 도우너에요",
      };
      //TODO 임시 나중엔 USER의 메시지만 가도록 수정
      const res = await axios.post("/api/messages", [newMessage, newAiMessage]);
      setInput(""); // 입력 필드 초기화
      setMessages(res.data.length === 1 ? [...res.data] : [...res.data]);
    } catch (error) {
      console.error("error sending msg", error);
    }
  };

  // 메시지가 업데이트될 때 스크롤
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  //컴포넌트가 마운트 될 때 메시지 로드
  useEffect(() => {
    fetchMessages();
  }, []);
  // useEffect(() => {
  //   const eventSource = new EventSource("YOUR_API_ENDPOINT");

  //   eventSource.onmessage = (event) => {
  //     setMessages((prevMessages) => [...prevMessages, event.data]);
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);
  return (
    <div className="flex h-screen min-w-80 flex-col bg-gradient-to-tr from-[#000000] to-[#0C3E8D]">
      <div className="relative flex h-24 items-center justify-start px-8 py-7">
        <Logo className="h-full w-auto" />
      </div>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="history flex-1 gap-2 overflow-y-auto p-6">
        {/* 마지막 요소를 제외한 모든 메시지 렌더링 */}
        {messages
          .slice(0, -1)
          .map((item, idx) =>
            item.id === 1 ? (
              <UserDialog data={item} key={idx} />
            ) : (
              <AiDialog data={item} key={idx} />
            ),
          )}

        {/* 마지막 메시지 요소 렌더링 */}
        {messages.length > 0 && (
          <div className="rounded-lg bg-yellow-400 p-4">
            {messages[messages.length - 1].id === 1 ? (
              <UserDialog
                data={messages[messages.length - 1]}
                key={messages.length - 1}
                last={true}
              />
            ) : (
              <AiDialog
                data={messages[messages.length - 1]}
                key={messages.length - 1}
                last={true}
              />
            )}
          </div>
        )}

        <div ref={endOfMessagesRef}></div>
      </div>
      {/* input 창 */}
      <div className="sticky bottom-0 flex min-h-32 flex-col border-[#595959] bg-[#1D1D1D] px-14 pb-6 pt-10">
        <div className="flex w-full justify-between gap-2 rounded">
          <input
            type="text"
            className="flex w-3/4 gap-1 rounded bg-[#1D1D1D] p-1 align-middle text-[#BDBDBD]"
            placeholder="메시지를 입력하세요"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></input>
          <Send
            className="w-8 cursor-pointer fill-[#BDBDBD] text-center hover:fill-current hover:text-[#2B4BDA]"
            onClick={handleSubmitMsg}
          >
            입력
          </Send>
        </div>
        <div className="relative mt-6 flex h-8 items-center justify-center">
          <PoweredByLogo className="h-full w-auto" />
        </div>
      </div>
    </div>
  );
}

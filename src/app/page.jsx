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
} from "@/services/messages";
import Button from "@/components/buttons/Button";
import AIImages from "@/components/message/AIImages";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);
  const [streamingMessage, setStreamingMessage] = useState("");

  const loadMessages = async () => {
    try {
      const res = await getHistory();

      setMessages(res.data);
    } catch (error) {
      console.error("error fetching data", error);
    }
  };

  const handleSubmitMsg = async (e) => {
    e.preventDefault();

    try {
      const newMessage = input;

      const res = await postMessage(newMessage);
      if (res.status === 200) {
        // 사용자 메시지 추가
        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setInput(""); // 입력 필드 초기화
        setStreamingMessage(""); // 스트리밍 메시지 초기화
        // AI 응답을 이벤트 스트림으로 받기
        const aiUrl = await postAIMessageUrl();

        const eventSource = new EventSource(aiUrl);
        eventSource.onmessage = async (event) => {
          const newContent = event.data.replace(/\*/g, " ");

          setStreamingMessage((prev) => prev + newContent);
        };

        eventSource.onerror = () => {
          console.error("Error in AI message stream.");
          eventSource.close();
        };
      }
    } catch (error) {
      if (error.response) {
        console.error("Error sending msg:", error.response.data);
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };
  console.log(messages);
  // 메시지가 업데이트될 때 스크롤
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingMessage]);

  // 스트리밍 메시지가 변경될 때마다 messages 업데이트
  useEffect(() => {
    if (streamingMessage) {
      setMessages((prev) => {
        const updatedMessages = [...prev];
        if (
          updatedMessages.length > 0 &&
          updatedMessages[updatedMessages.length - 1].role === "assistant"
        ) {
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            content: streamingMessage,
          };
        } else {
          updatedMessages.push({
            role: "assistant",
            content: streamingMessage,
          });
        }
        return updatedMessages;
      });
    }
  }, [streamingMessage]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmitMsg();
    }
  };

  const handleButtonClick = async () => {
    console.log("click");
    const res = await getHealthCheck();
    console.log(res);
  };

  // //컴포넌트가 마운트 될 때 메시지 로드
  // useEffect(() => {
  //   loadMessages();
  // }, []);

  return (
    <div className="flex h-screen min-w-80 flex-col bg-gradient-to-tr from-[#000000] to-[#0C3E8D]">
      <div className="relative flex h-24 items-center justify-start px-8 py-7">
        <Logo className="h-full" />
      </div>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="history flex-1 items-start gap-2 overflow-y-auto p-6">
        {/* //buttonGroup */}
        <div className={"flex flex-row gap-3"}>
          <Button text={"재료"}></Button>
          <Button text={"재료"}></Button>
          <Button
            text={"재료 선택됨"}
            onClick={handleButtonClick}
            isSelected={true}
          ></Button>
        </div>

        <AIImages></AIImages>
        {messages.map((item, idx) =>
          item.role === "user" ? (
            <UserDialog key={idx} />
          ) : (
            <>
              <AiDialog data={item} key={idx} />
              <Button text={"재료"} onClick={handleButtonClick}></Button>
            </>
          ),
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
            onKeyDown={handleKeyDown} // Enter 키를 감지
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

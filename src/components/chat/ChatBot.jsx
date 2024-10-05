import Logo from "@/images/logo/ansys_chatbot_logo.svg";
import PoweredByLogo from "@/images/logo/poweredby_logo.svg";
import Send from "@/images/icon/send.svg";
import Refresh from "@/images/icon/refresh.svg";
import AiDialog from "@/components/message/AiDialog";
import UserDialog from "@/components/message/UserDialog";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  getHistory,
  postAIMessageUrl,
  postImages,
  postMessage,
  postWorkSpace,
} from "@/services/messages";
import Button from "@/components/buttons/Button";
import AIImages from "@/components/message/AIImages";

const checkKeywords = (str) => {
  // 찾고자 하는 키워드 리스트

  // 정규표현식으로 키워드를 묶어서 검사 (|는 OR 연산)
  const regex = /(디자인을 추천해줘|디자인 추천|디자인 추천해줘)/;

  // match로 정규표현식에 매칭되는지 검사
  return regex.test(str);
};

export default function ChatBot({ spaceId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [guideChoice, setGuideChoice] = useState(0);
  const endOfMessagesRef = useRef(null);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [workSpaceId, setWorkSpaceId] = useState(spaceId); //todo 추후 랜덤으로
  const [isFirst, setIsFirst] = useState(messages.length > 0 ? 0 : 1);

  const handleGreeting = async () => {
    // 사용자 메시지 추가
    // AI 응답을 이벤트 스트림으로 받기
    const aiUrl = await postAIMessageUrl({ workSpaceId, isFirst: 1 });
    const eventSource = new EventSource(aiUrl);

    eventSource.onmessage = async (event) => {
      const newContent = event.data.replace(/\*/g, " ");
      if (newContent) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: newContent },
        ]);
      } else {
        console.error("Received undefined content");
      }

      // setStreamingMessage((prev) => prev + newContent);
    };
    // 서버와의 연결이 닫힐 때 실행
    eventSource.onclose = () => {
      console.log("Connection closed by server or streaming finished.");
      eventSource.close(); // 연결 닫기
    };

    eventSource.onerror = () => {
      console.log("Error in AI message stream.");
      eventSource.close();
    };

    // 첫 메시지를 보낸 후 isFirst를 0으로 설정
    setIsFirst(0);

    return () => {
      eventSource.close();
    };
  };

  const loadMessages = async () => {
    try {
      const res = await getHistory(workSpaceId);

      const msgs = res.data;
      console.log("msg");
      console.log(msgs);

      if (msgs.length === 0 && isFirst === 1) {
        // 첫 메시지만 보냄
        console.log("grret");
        await handleGreeting(); // 첫 메시지 전송 후 isFirst를 0으로 설정
      } else {
        setMessages([...msgs]);
      }
    } catch (error) {
      console.error("error fetching data", error);
    }
  };

  const onClickGuideButton = async (choice) => {
    let string = "";
    if (choice === 1) {
      string = "재료 추천해줘";
    }
    if (choice === 2) string = "해석해줘";

    setGuideChoice(choice);
    handleSubmitMsg(string);
  };

  const handleSubmitMsg = async (buttonMessage = "") => {
    const msg = buttonMessage !== "" ? buttonMessage : input;
    const newMessage = { message: msg, workSpaceId: workSpaceId };

    try {
      const res = await postMessage(newMessage);
      if (res.status === 200) {
        if (checkKeywords(msg)) {
          const res = await postImages(workSpaceId);
          setMessages((prev) => [...prev, { role: "user", content: msg }]);
          setInput(""); // 입력 필드 초기화
          loadMessages();
          console.log(res);
          return;
        } else {
          // 사용자 메시지 추가

          setMessages((prev) => [...prev, { role: "user", content: msg }]);
          setInput(""); // 입력 필드 초기화
          setStreamingMessage(""); // 스트리밍 메시지 초기화
          // AI 응답을 이벤트 스트림으로 받기
          const aiUrl = await postAIMessageUrl({ workSpaceId, isFirst });
          const eventSource = new EventSource(aiUrl);
          eventSource.onmessage = async (event) => {
            const newContent = event.data.replace(/\*/g, " ");

            setStreamingMessage((prev) => prev + newContent);
          };

          // 서버와의 연결이 닫힐 때 실행
          eventSource.onclose = () => {
            console.log("Connection closed by server or streaming finished.");
            setIsFirst(0); // 첫 메시지 전송 완료 후 초기화
            eventSource.close(); // 연결 닫기
          };

          eventSource.onerror = () => {
            console.log("Error in AI message stream.");
            eventSource.close();
          };

          return () => {
            eventSource.close();
          };
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Error sending msg:", error.response.data);
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };
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
          updatedMessages.length !== 1 &&
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
  // useEffect(() => {
  //   if (streamingMessage) {
  //     // 스트리밍 메시지 수신 중에는 메시지를 계속 업데이트하지 않음
  //     return;
  //   }
  // }, [streamingMessage]);

  // const onWorkSpaceId = async () => {
  //   try {
  //     const res = await postWorkSpace();

  //     if (res.status !== 200) {
  //       throw new Error();
  //     }

  //     setWorkSpaceId(res.data); // 워크스페이스 ID 업데이트
  //   } catch (err) {
  //     console.error("refresh error", err);
  //   }
  // };

  const onClickRefresh = async () => {
    try {
      // 상태 초기화
      setIsFirst(1); // 처음 상태로 되돌림
      setMessages([]); // 메시지 리스트 초기화

      // 새로운 워크스페이스 요청
      const res = await postWorkSpace();

      if (res.status !== 200) {
        throw new Error();
      }

      // 새로운 워크스페이스 ID 설정
      setWorkSpaceId(res.data);
    } catch (err) {
      console.error("refresh error", err);
    }
  };

  // const onClickRefresh = async () => {
  //   try {
  //     // 먼저 상태 초기화
  //     await setIsFirst(1); // 처음 상태로 설정
  //     await setMessages([]); // 메시지 초기화

  //     const res = await postWorkSpace();
  //     if (res.status !== 200) {
  //       throw new Error();
  //     }
  //     await setWorkSpaceId(res.data);
  //   } catch (err) {
  //     console.error("refresh error");
  //   }
  // };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (workSpaceId && isFirst === 1) {
      handleGreeting(); // 처음 상태일 때만 그리팅 메시지 전송
    }
  }, [workSpaceId]);
  return (
    <div className="flex h-screen min-w-80 flex-col bg-gradient-to-tr from-[#000000] to-[#0C3E8D]">
      <div className="relative flex h-24 items-center justify-between px-6 py-7">
        <Logo className="h-full" />
        <Refresh className="h-full cursor-pointer" onClick={onClickRefresh} />
      </div>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className="history flex-1 items-start gap-2 overflow-y-auto p-6">
        {/* //buttonGroup */}

        {messages.map((item, idx) =>
          item.role === "user" ? (
            <UserDialog key={idx} data={item} />
          ) : item.content !== "images" ? (
            <div key={idx}>
              <AiDialog data={item} />
              {isFirst === 1 && (
                <div className={"flex flex-row gap-3"}>
                  <Button
                    text={"재료"}
                    onClick={() => onClickGuideButton(1)}
                    isSelected={guideChoice === 1 ? true : false}
                  ></Button>
                  <Button
                    text={"해석"}
                    onClick={() => onClickGuideButton(2)}
                    isSelected={guideChoice === 2 ? true : false}
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <AIImages></AIImages>
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

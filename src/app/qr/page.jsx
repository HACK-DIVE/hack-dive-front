"use client";
import ChatBot from "@/components/chat/ChatBot";
import { postWorkSpace } from "@/services/messages";
import { useEffect, useState } from "react";

export default function Page() {
  const [workSpaceId, setWorkSpaceId] = useState(null); // null로 초기화

  useEffect(() => {
    const fetchWorkSpaceId = async () => {
      if (workSpaceId !== null) return; // null로 체크

      try {
        const res = await postWorkSpace();
        console.log("Workspace response:", res);
        if (res.status === 200) {
          setWorkSpaceId(res.data);
        } else {
          throw new Error("Failed to get workspace ID");
        }
      } catch (err) {
        console.error("refresh error", err);
        // 사용자에게 에러 피드백 추가 (예: alert)
      }
    };

    fetchWorkSpaceId();
  }, []); // 의존성 배열에 추가

  return (
    <>
      {workSpaceId === null ? ( // null 체크
        <p>Loading workspace...</p>
      ) : (
        <ChatBot spaceId={workSpaceId}></ChatBot>
      )}
    </>
  );
}

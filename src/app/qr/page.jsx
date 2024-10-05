"use client";
import ChatBot from "@/components/chat/ChatBot";
import { postWorkSpace } from "@/services/messages";
import { useEffect, useState } from "react";

export default function Page() {
  const [workSpaceId, setWorkSpaceId] = useState(0);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const onWorkSpaceId = async () => {
      if (workSpaceId !== 0) return; // 이미 workSpaceId가 설정되었으면 더 이상 요청하지 않음

      try {
        const res = await postWorkSpace();
        console.log("Workspace response:", res); // 응답 로그 확인
        if (res.status === 200) {
          setWorkSpaceId(res.data);
        } else {
          throw new Error("Failed to get workspace ID");
        }
      } catch (err) {
        console.error("refresh error", err); // 에러 로그 확인
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    (async () => {
      await onWorkSpaceId();
    })();
  }, [workSpaceId]);

  return (
    <>
      {loading ? (
        <p>Loading workspace...</p> // 로딩 중일 때 메시지
      ) : workSpaceId !== 0 ? (
        <ChatBot spaceId={workSpaceId}></ChatBot>
      ) : (
        <p>Error loading workspace</p>
      )}
    </>
  );
}

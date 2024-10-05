"use client";
import ChatBot from "@/components/chat/ChatBot";
import { postWorkSpace } from "@/services/messages";
import { useEffect, useState } from "react";

export default function Page() {
  const [workSpaceId, setWorkSpaceId] = useState(null); // null로 초기화
  const [isFirst, setIsFirst] = useState(1); // isFirst 상태를 부모로 이동
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
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

    fetchWorkSpaceId();
  }, []);

  if (loading) return <p>Loading workspace...</p>;
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
}

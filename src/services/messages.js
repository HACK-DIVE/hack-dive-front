import axiosApi from "./axios";
import { API_URLS } from "@/constants/config";

const workSpaceId = 1;
const useId = 1;
//user 메세지 보내는 api
export const postMessage = async (message) => {
  const res = await axiosApi.post(`${API_URLS.message}/send/${workSpaceId}`, {
    message: message,
  });

  console.log(res);
  return res.data;
};

//1이면 first 0이면 아님

export const postAIMessageUrl = async (isFirst = 0) =>
  `${process.env.NEXT_PUBLIC_API_URL}${API_URLS.message}/recieve/${workSpaceId}/${isFirst}`;

export const getHistory = async () => {
  const res = await axiosApi.get(`${API_URLS.message}/${workSpaceId}`);

  console.log(res);
  return res.data;
};

//응답은 워크스페이스 Id
export const postWorkSpace = async () => {
  const res = await axiosApi.post(`${API_URLS.workspace}/generation/${useId}`);

  console.log(res);
  return res.data;
};

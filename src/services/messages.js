import axiosApi from "./axios";
import { API_URLS } from "@/constants/config";

const workSpaceId = 1;
const useId = 1;
//user 메세지 보내는 api
export const postMessage = async ({ text }) => {
  const res = await axiosApi.post(`${API_URLS.message}/send/${workSpaceId}`, {
    message: text,
  });

  console.log(res);
  return res.data;
};

//1이면 first 0이면 아님
export const getAIMessage = async ({ isFirst = 0 }) => {
  const res = await axiosApi.get(
    `${API_URLS.message}/recieve/${workSpaceId}/${workSpaceId}/${isFirst}`,
  );

  console.log(res);
  return res.data;
};

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

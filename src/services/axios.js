import axios from "axios";

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_HTTPS, // 여기에 API의 기본 URL을 입력하세요
  timeout: 10000, // 선택적으로 타임아웃 설정 (10초)
  headers: {
    "Content-Type": "application/json", // 선택적으로 기본 헤더 설정
  },
});

export default axiosApi;

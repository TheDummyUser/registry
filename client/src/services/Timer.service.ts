import axios from "axios";
import { base_url, api_urls } from "./urls";

export const checkTimer = async (token: string) => {
  try {
    const response = await axios.get(`${base_url}/${api_urls.checkTimer}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("request failed", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          `HTTP error! Status: ${error.response?.status}`,
      );
    }
    throw error;
  }
};

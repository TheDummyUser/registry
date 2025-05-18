import { base_url, api_urls } from "./urls";
import axios from "axios";

export async function login(email, password) {
  try {
    const response = await axios.post(
      `${base_url}/${api_urls.login}`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          `HTTP error! Status: ${error.response?.status}`,
      );
    }
    throw error;
  }
}

export async function signup(email, password) {
  try {
    const response = await axios.post(
      `${base_url}/${api_urls.signup}`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          `HTTP error! Status: ${error.response?.status}`,
      );
    }
    throw error;
  }
}

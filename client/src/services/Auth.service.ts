import { base_url, api_urls } from "./urls";
import axios, { AxiosError } from "axios";

interface LoginResponse {
  // Define the structure of your login response data here
  [key: string]: any; // Or, replace with specific properties if known
}

interface SignupResponse {
  // Define the structure of your signup response data here
  [key: string]: any; // Or, replace with specific properties if known
}

interface RefreshResponse {
  // Define the structure of your refresh response data here
  [key: string]: any; // Or, replace with specific properties if known
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
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
  } catch (error: any) {
    console.error("Login failed:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        axiosError.response?.data?.message ||
          `HTTP error! Status: ${axiosError.response?.status}`,
      );
    }
    throw error;
  }
}

export async function signup(
  email: string,
  password: string,
): Promise<SignupResponse> {
  try {
    const response = await axios.post<SignupResponse>(
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
  } catch (error: any) {
    console.error("Signup failed:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        axiosError.response?.data?.message ||
          `HTTP error! Status: ${axiosError.response?.status}`,
      );
    }
    throw error;
  }
}

export async function refresh(token: string): Promise<RefreshResponse> {
  try {
    const response = await axios.post<RefreshResponse>(
      `${base_url}/${api_urls.refresh}`,
      {
        refresh_token: token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("refresh failed", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        axiosError.response?.data?.message ||
          `HTTP error! Status: ${axiosError.response?.status}`,
      );
    }
    throw error;
  }
}

export async function logout(token: string): Promise<any> {
  // Or define a specific type if known
  try {
    const response = await axios.post(
      `${base_url}/${api_urls.logout}`,
      {
        refresh_token: token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.error("refresh failed", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw new Error(
        axiosError.response?.data?.message ||
          `HTTP error! Status: ${axiosError.response?.status}`,
      );
    }
    throw error;
  }
}

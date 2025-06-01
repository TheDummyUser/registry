import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { base_url, endpoints } from "../api";
import type { AuthResponse } from "@/utils/api.types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: ({ email: email, password }) => ({
        url: endpoints.login,
        method: "POST",
        body: { email, password },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;

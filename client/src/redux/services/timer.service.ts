import { createApi } from "@reduxjs/toolkit/query/react";

import { endpoints } from "../api";
import { baseQueryWithReauth } from "./baseQuery";

export const timerApi = createApi({
  reducerPath: "timerApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    checkTimer: builder.query({
      query: () => ({
        url: endpoints.checkTimer,
        method: "GET",
      }),
    }),
    startTimer: builder.query({
      query: () => ({
        url: endpoints.sartTimer,
        method: "GET",
      }),
    }),
    stopTimer: builder.query({
      query: () => ({
        url: endpoints.stopTimer,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCheckTimerQuery,
  useLazyStopTimerQuery,
  useLazyStartTimerQuery,
} = timerApi;

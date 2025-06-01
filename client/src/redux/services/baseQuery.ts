import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { base_url, endpoints } from "../api";
import type { RootState } from "../store";
import { clearAuth, updateTokens } from "../slices/auth.slice";

export const baseQuery = fetchBaseQuery({
  baseUrl: base_url,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.tokens?.access_token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, store, extraOptions) => {
  let result = await baseQuery(args, store, extraOptions);

  const authState = (store.getState() as RootState).auth;

  if (result.error && result.error.status === 401) {
    if (!authState.tokens?.refresh_token) return result;

    // Try to refresh the token
    console.log("we are doing it boiz");
    const refreshResult = await baseQuery(
      {
        url: endpoints.refresh,
        method: "POST",
        body: { refresh_token: authState.tokens.refresh_token },
      },
      store,
      extraOptions,
    );

    if (refreshResult.data) {
      const newTokens = refreshResult.data as {
        access_token: string;
        refresh_token: string;
      };

      // Store the new tokens
      store.dispatch(updateTokens(newTokens));

      // Retry the original request
      result = await baseQuery(args, store, extraOptions);
    } else {
      store.dispatch(clearAuth());
    }
  }

  return result;
};

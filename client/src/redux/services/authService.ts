import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

import { base_url, api_urls } from '../urls';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: base_url }),
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: api_urls.login,
        method: 'POST',
        body: { email, password },
      }),
    }),
    register: builder.mutation({
      query: (body) => ({
        url: api_urls.signup,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

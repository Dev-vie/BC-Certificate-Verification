import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { setToken, logout } from "./features/auth/authSlice";
import { getApiBaseUrl } from "../lib/apiConfig";

const BASE_URL = getApiBaseUrl();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const stateToken = (getState() as RootState).auth?.token;
    const token = stateToken || localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function onTokenRefreshed(token: string | null) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string | null) => void) {
  refreshSubscribers.push(callback);
}

async function requestTokenRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const newToken = data?.token;
    if (newToken) {
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      const newToken = await requestTokenRefresh();
      isRefreshing = false;

      if (newToken) {
        api.dispatch(setToken(newToken));
        onTokenRefreshed(newToken);
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        onTokenRefreshed(null);
        api.dispatch(logout());

        const path = window.location.pathname;
        const isPublicPage =
          path.startsWith("/auth/") ||
          path === "/home" ||
          path === "/" ||
          path.startsWith("/verify/") ||
          path === "/privacy" ||
          path === "/terms" ||
          path === "/contact";

        if (!isPublicPage) {
          window.location.href = "/auth/login";
        }
      }
    } else {
      const retryToken = await new Promise<string | null>((resolve) => {
        addRefreshSubscriber(resolve);
      });

      if (retryToken) {
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { setToken, logout } from "./features/auth/authSlice";
import { getApiBaseUrl } from "../lib/apiConfig";
import {
  getStoredCertificates,
  findMockCertificate,
  createMockCertificate,
  revokeMockCertificate,
  deleteMockCertificate,
  getStoredTemplates,
  MOCK_INSTITUTION,
} from "../data/mockStore";

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

function handleMockFallback(args: string | FetchArgs) {
  const url = typeof args === "string" ? args : args.url;
  const method = (typeof args === "string" ? "GET" : args.method || "GET").toUpperCase();
  const body = typeof args === "string" ? null : args.body;

  // Certificates endpoints
  if (url === "/certificates" || url.startsWith("/certificates?")) {
    return { data: { certificates: getStoredCertificates() } };
  }

  if (url === "/certificates/issue" && method === "POST") {
    const cert = createMockCertificate(body as any);
    return { data: { certificate: cert } };
  }

  if (url === "/certificates/issue-bulk" && method === "POST") {
    const cert1 = createMockCertificate({
      recipientName: "Bulk Recipient Alpha",
      course: "Distributed Ledger Architecture",
      grade: "Distinction",
    });
    const cert2 = createMockCertificate({
      recipientName: "Bulk Recipient Beta",
      course: "Distributed Ledger Architecture",
      grade: "Merit",
    });
    return { data: { success: true, count: 2, certificates: [cert1, cert2] } };
  }

  if (url.includes("/revoke") && method === "PATCH") {
    const id = url.split("/")[2] || "";
    const updated = revokeMockCertificate(id);
    return { data: { certificate: updated } };
  }

  if (url.startsWith("/certificates/") && method === "DELETE") {
    const id = url.split("/")[2] || "";
    deleteMockCertificate(id);
    return { data: { id } };
  }

  if (url.startsWith("/certificates/") && method === "GET") {
    const id = url.split("/")[2] || "";
    const cert = findMockCertificate(id) || getStoredCertificates()[0];
    return { data: { certificate: cert } };
  }

  // Templates endpoints
  if (url === "/templates" && method === "GET") {
    return { data: { templates: getStoredTemplates() } };
  }

  if (url === "/templates" && method === "POST") {
    const templates = getStoredTemplates();
    const newTpl = {
      id: String(templates.length + 1),
      title: "New Diploma Template",
      filePath: "/templates/sample-diploma.png",
      placeholders: [],
      fieldsCount: 0,
      createdAt: new Date().toISOString(),
    };
    return { data: { template: newTpl } };
  }

  if (url.startsWith("/templates/") && method === "DELETE") {
    const id = url.split("/")[2] || "";
    return { data: { id } };
  }

  if (url.startsWith("/templates/") && method === "PATCH") {
    const templates = getStoredTemplates();
    return { data: { template: templates[0] } };
  }

  if (url === "/auth/me") {
    return { data: { institution: MOCK_INSTITUTION } };
  }

  return null;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // If there's an error (backend down, DB paused, 401/404/500), try fallback to mock data first!
  if (result.error) {
    const mockData = handleMockFallback(args);
    if (mockData) {
      return mockData;
    }
  }

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

  if (result.error) {
    const mockData = handleMockFallback(args);
    if (mockData) {
      return mockData;
    }
  }

  return result;
};

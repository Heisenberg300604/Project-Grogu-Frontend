/**
 * The HTTP client every service call goes through.
 *
 * This file used to fake the network with a `setTimeout`; it now talks to the
 * Grogu API. {@link ServiceError} and its `code` union are unchanged, so the
 * error branches already written in the UI keep working — the codes are now
 * produced by the server instead of by the mock.
 */

import { apiBaseUrl, TOKEN_STORAGE_KEY } from "@/lib/config";

export type ServiceErrorCode =
  | "not-found"
  | "invalid-credentials"
  | "conflict"
  | "forbidden"
  | "validation"
  | "network"
  | "server-error";

/** A predictable error type the UI can branch on. */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly code: ServiceErrorCode = "validation",
    readonly status?: number,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

/* -------------------------------------------------------------------------- */
/*  Token                                                                      */
/* -------------------------------------------------------------------------- */
// Held in a module variable so server-side calls and the first client render
// do not have to touch localStorage, and mirrored into localStorage so a
// session survives a reload.

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;

  if (typeof window === "undefined") return;

  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Private browsing or blocked storage: the in-memory token still works for
    // this tab, the session just will not survive a reload.
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken;
  if (typeof window === "undefined") return null;

  try {
    authToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    authToken = null;
  }

  return authToken;
}

/* -------------------------------------------------------------------------- */
/*  Request                                                                    */
/* -------------------------------------------------------------------------- */

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Send the bearer token when there is one. Defaults to true. */
  auth?: boolean;
  signal?: AbortSignal;
  /** Next.js fetch caching, for the server-side accessors in `data/`. */
  cache?: RequestCache;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true, signal, cache } = options;

  const headers: Record<string, string> = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
      cache,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    // Naming the URL matters in development: the usual cause is the backend
    // not running, or running on a different port than NEXT_PUBLIC_API_BASE_URL.
    throw new ServiceError(
      `Couldn't reach the Grogu API at ${apiBaseUrl()}. ` +
        "Check that the backend is running and that NEXT_PUBLIC_API_BASE_URL " +
        "points at it.",
      "network",
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const raw = await response.text();

  let payload: unknown = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    throw toServiceError(response.status, payload);
  }

  return payload as T;
}

/**
 * The API returns `{ message, code }` on failure, where `code` is already one
 * of this module's codes. Status is the fallback for anything that did not come
 * from the API itself (a proxy error page, say).
 */
function toServiceError(status: number, payload: unknown): ServiceError {
  const shape = (payload ?? {}) as { message?: unknown; code?: unknown };

  const message =
    typeof shape.message === "string" && shape.message.trim()
      ? shape.message
      : defaultMessageForStatus(status);

  const code =
    typeof shape.code === "string"
      ? (shape.code as ServiceErrorCode)
      : codeForStatus(status);

  return new ServiceError(message, code, status);
}

function codeForStatus(status: number): ServiceErrorCode {
  switch (status) {
    case 400:
      return "validation";
    case 401:
      return "invalid-credentials";
    case 403:
      return "forbidden";
    case 404:
      return "not-found";
    case 409:
      return "conflict";
    default:
      return status >= 500 ? "server-error" : "validation";
  }
}

function defaultMessageForStatus(status: number): string {
  switch (status) {
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You don't have access to that.";
    case 404:
      return "We couldn't find that.";
    case 409:
      return "That conflicts with something that already exists.";
    default:
      return status >= 500
        ? "The Grogu server had a problem. Please try again."
        : "That request couldn't be completed.";
  }
}

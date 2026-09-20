/**
 * Runtime configuration read from the environment.
 *
 * `NEXT_PUBLIC_*` values are inlined into the client bundle at build time, so
 * only non-secret values belong here. The API base URL qualifies: it is a
 * public endpoint the browser has to call directly.
 */

/**
 * Resolved on first use rather than at module load, so an unset variable fails
 * the request that needed it instead of the whole build.
 */
export function apiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  // Local development convenience only. A deployed build without the variable
  // set would otherwise point the browser at the developer's own machine, so
  // it fails loudly instead.
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8080";
  }

  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not set. Point it at the Grogu API " +
      "(for example https://grogu-backend.onrender.com).",
  );
}

/** Where the bearer token is kept between visits. */
export const TOKEN_STORAGE_KEY = "grogu.auth.token";

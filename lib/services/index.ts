/**
 * Service layer — the single seam between the UI and the Grogu API.
 *
 * Every function here calls `/api/v1/*` through `lib/services/http` and writes
 * the server's response into the client cache (`lib/store/grogu-store`).
 * Components never fetch directly and never mutate the store themselves.
 */

export * as authService from "./auth";
export * as applicationsService from "./applications";
export * as testsService from "./tests";
export * as gamesService from "./games";
export * as playtestsService from "./playtests";
export * as notificationsService from "./notifications";
export * as profileService from "./profile";
export { fetchBootstrap } from "./bootstrap";
export type { BootstrapSnapshot } from "./bootstrap";
export { ServiceError, setAuthToken, getAuthToken } from "./http";

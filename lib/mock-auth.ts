/**
 * Authentication — public entry point.
 *
 * Kept at this path because the components import from it; the name is a
 * leftover from when auth was faked. It now re-exports `lib/services/auth`,
 * which signs in against the Grogu API and holds a real bearer token.
 */

export {
  login,
  loginAsDemo,
  signup,
  logout,
  getSession,
  DEMO_ACCOUNTS,
  DEMO_PASSWORD,
} from "@/lib/services/auth";
export type {
  LoginInput,
  SignupInput,
  TesterSignupInput,
  DeveloperSignupInput,
} from "@/lib/services/auth";

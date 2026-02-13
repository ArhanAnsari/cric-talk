import { AppwriteError } from "@/interfaces/AppwriteError";
import { showToast } from "../showToast";

const authErrors: Record<string, string> = {
  user_password_mismatch:
    "The passwords don’t match. Please re-enter them carefully.",
  user_ip_not_whitelisted:
    "Access from this network isn’t allowed. Please contact support if this seems wrong.",
  user_invalid_credentials:
    "Invalid email or password. Please check your details and try again.",
  user_session_already_exists: "You’re already logged in on this device.",
  user_unauthorized: "You don’t have permission to perform this action.",
  user_not_found: "We couldn’t find an account with those details.",
  user_session_not_found: "Your session has expired. Please log in again.",
  user_email_already_exists:
    "This email is already registered. Try logging in instead.",
};

export function handleAuthError({
  mainText,
  error,
}: {
  mainText: string;
  error: AppwriteError;
}) {
  showToast({
    type: "error",
    text1: mainText,
    text2: authErrors[error.type],
  });
}

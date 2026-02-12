import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { forgotPassword, resetPassword } from "../api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);

  const handleCheckEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    setEmailChecked(false);
    setResetToken(null);
    try {
      const response = await forgotPassword({ email });
      if (!response.email_exists || !response.reset_token) {
        setStatus("error");
        setMessage("Email not found in the database.");
        return;
      }
      setResetToken(response.reset_token);
      setEmailChecked(true);
      setStatus("idle");
      setMessage("Email found. Enter your new password.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to verify email.");
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resetToken) {
      setStatus("error");
      setMessage("Reset token missing. Please check your email first.");
      return;
    }
    setStatus("loading");
    setMessage(null);
    try {
      await resetPassword({ token: resetToken, new_password: newPassword });
      setStatus("success");
      setMessage("Password updated. You can now sign in.");
      setNewPassword("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to reset password.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
          M
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">MoringaDesk</p>
          <p className="text-xs text-slate-500">Knowledge Platform</p>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Forgot password</h1>
        <p className="text-sm text-slate-500">
          Enter your email to verify it, then set a new password.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleCheckEmail}>
        <div>
          <label className="text-sm font-medium text-slate-700">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus-ring"
            required
            disabled={emailChecked}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/80 focus-ring disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "loading" || emailChecked}
        >
          {status === "loading" ? "Checking..." : "Check email"}
        </button>
      </form>

      {emailChecked ? (
        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label className="text-sm font-medium text-slate-700">New password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus-ring"
              minLength={8}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/80 focus-ring disabled:cursor-not-allowed disabled:opacity-70"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Updating..." : "Update password"}
          </button>
        </form>
      ) : null}

      {message ? (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            status === "error"
              ? "border-rose-200 bg-rose-50 text-rose-600"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </p>
      ) : null}

      <p className="text-center text-sm text-slate-500">
        Remembered your password?{" "}
        <Link to="/login" className="rounded-md font-medium text-slate-900 focus-ring">
          Back to sign in
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;

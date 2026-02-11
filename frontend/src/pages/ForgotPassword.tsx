import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { forgotPassword } from "../api/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      await forgotPassword({ email });
      setStatus("success");
      setMessage(
        "If the email exists, a reset link will be sent. Check the server console for the token."
      );
    } catch {
      setStatus("error");
      setMessage("Unable to request reset. Please try again.");
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
          Enter your email to receive a reset token.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-700">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus-ring"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/80 focus-ring disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Sending..." : "Send reset token"}
        </button>
      </form>

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

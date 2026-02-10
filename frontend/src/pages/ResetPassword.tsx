import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { resetPassword } from "../api/auth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    try {
      await resetPassword({ token, new_password: password });
      setStatus("success");
      setMessage("Password updated. You can now sign in.");
    } catch {
      setStatus("error");
      setMessage("Reset failed. Check your token and try again.");
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
        <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
        <p className="text-sm text-slate-500">
          Paste the token from the server console and set a new password.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-slate-700">Reset token</label>
          <input
            type="text"
            placeholder="Paste token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus-ring"
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">New password</label>
          <input
            type="password"
            placeholder="Enter a new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
        Ready to log in?{" "}
        <Link to="/login" className="rounded-md font-medium text-slate-900 focus-ring">
          Back to sign in
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;

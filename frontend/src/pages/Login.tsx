import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, type Location } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginUser, selectAuth } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useAppSelector(selectAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = (location.state as { from?: Location })?.from;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      const fallbackDestination =
        result.role === "admin" ? "/admin/dashboard" : "/dashboard";
      const destination = from
        ? `${from.pathname}${from.search}${from.hash}`
        : fallbackDestination;
      navigate(destination, { replace: true });
    } catch {
      // Errors are handled in state
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
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Sign in to continue to MoringaDesk.</p>
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
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus-ring"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200/80 focus-ring disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="rounded-md font-medium text-slate-900 focus-ring">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;

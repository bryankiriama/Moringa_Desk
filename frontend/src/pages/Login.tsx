import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500">Sign in to continue to MoringaDesk.</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus-ring"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white focus-ring"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="rounded-md font-medium text-indigo-600 focus-ring">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;

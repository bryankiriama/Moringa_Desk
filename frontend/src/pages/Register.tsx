import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500">Join the MoringaDesk community today.</p>
      </div>

      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <input
            type="text"
            placeholder="Your name"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-indigo-600">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;

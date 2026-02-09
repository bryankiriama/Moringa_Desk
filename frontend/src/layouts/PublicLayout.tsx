import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#f7f5f1] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.16),transparent_40%)]" />
      <main className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-6 py-12 lg:grid-cols-[1.1fr,0.9fr]">
        <section className="rounded-[28px] border border-white/60 bg-white/70 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
            MoringaDesk <span className="ml-1 text-amber-500">•</span>
          </p>
          <h1 className="mt-5 text-4xl font-semibold text-slate-900 sm:text-5xl">
            The learning desk where real questions become lasting knowledge.
          </h1>
          <p className="mt-5 max-w-xl text-sm text-slate-600">
            Ask, answer, and curate technical knowledge with a workflow designed for
            cohorts, mentors, and admins. Everything stays discoverable.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
              Curated tags
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
              Vote-driven clarity
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
              Mentor verified
            </span>
          </div>
        </section>

        <section className="w-full rounded-[28px] border border-white/60 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default PublicLayout;

import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-6 py-12">
        <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-semibold text-white">
                M
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">MoringaDesk</p>
                <p className="text-xs text-slate-500">Knowledge Platform</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicLayout;

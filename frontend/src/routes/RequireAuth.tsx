import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "../app/hooks";
import { AUTH_TOKEN_KEY } from "../api/client";
import { selectAuth } from "../features/auth/authSlice";

const RequireAuth = () => {
  const location = useLocation();
  const { token } = useAppSelector(selectAuth);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Loading session...
      </div>
    );
  }

  const storedToken = token ?? localStorage.getItem(AUTH_TOKEN_KEY);

  if (!storedToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;

import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AUTH_ROLE_KEY, AUTH_TOKEN_KEY } from "../api/client";
import { fetchCurrentUser, selectAuth } from "../features/auth/authSlice";

const RequireAuth = () => {
  const location = useLocation();
  const { token, role } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const storedToken = token ?? localStorage.getItem(AUTH_TOKEN_KEY);
    if (storedToken) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  if (!isReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Loading session...
      </div>
    );
  }

  const storedToken = token ?? localStorage.getItem(AUTH_TOKEN_KEY);
  const storedRole =
    role ?? (localStorage.getItem(AUTH_ROLE_KEY) as "admin" | "student" | null);

  if (!storedToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (storedRole === "admin" && location.pathname === "/dashboard") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

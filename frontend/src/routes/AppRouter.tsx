import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminFaqs from "../pages/AdminFaqs";
import AdminTags from "../pages/AdminTags";
import AdminUsers from "../pages/AdminUsers";
import AdminFlags from "../pages/AdminFlags";
import AskQuestion from "../pages/AskQuestion";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Notifications from "../pages/Notifications";
import QuestionDetail from "../pages/QuestionDetail";
import QuestionsList from "../pages/QuestionsList";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Trending from "../pages/Trending";
import MyActivity from "../pages/MyActivity";
import RequireAuth from "./RequireAuth";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<QuestionsList />} />
            <Route path="/questions/ask" element={<AskQuestion />} />
            <Route path="/questions/:questionId" element={<QuestionDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/me" element={<MyActivity />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="tags" element={<AdminTags />} />
            <Route path="faqs" element={<AdminFaqs />} />
            <Route path="flags" element={<AdminFlags />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

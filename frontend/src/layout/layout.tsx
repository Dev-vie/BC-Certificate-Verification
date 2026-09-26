import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "../pages/landingPage";
import RootLayout from "./rootLayout";
import LoginPage from "../pages/auth/loginPage";
import RegisterPage from "../pages/auth/registerPage";
import PendingApprovalPage from "../pages/auth/pendingApprovalPage";
import VerifyResetPage from "../pages/auth/resetVerifyPage";
import VerifyPage from "../pages/auth/verifyPage";
import ForgotPassPage from "../pages/auth/forgotPassPage";
import ResetPassPage from "../pages/auth/resetPassPage";
import GoogleCallbackPage from "../pages/auth/googleCallBackPage";
import DashboardPage from "../pages/dashboardPage";
import TemplatePage from "../pages/templatePage";
import TemplateEditorPage from "../pages/templateEditorPage";
import IssueCerficatePage from "../pages/issueCerficatePage";
import CertificatePage from "../pages/certificatePage";
import CertificateDetailPage from "../pages/certificatedetailPage";
import SettingPage from "../pages/settingPage";
import VerifyCertificatePage from "../pages/VerifyCertificatePage";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import { PrivacyPage, TermsPage, ContactPage } from "../pages/infoPages";

import AuthLayout from "./authLayout";

export const Router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Navigate to="/home" />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

      <Route
        path="/verify/:certificateId"
        element={<VerifyCertificatePage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/templates" element={<TemplatePage />} />
        <Route path="/templates/:id/edit" element={<TemplateEditorPage />} />
        <Route path="/issue-certificate" element={<IssueCerficatePage />} />
        <Route path="/certificates" element={<CertificatePage />} />
        <Route path="/certificates/:id" element={<CertificateDetailPage />} />
        <Route path="/settings" element={<SettingPage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/auth/verify" element={<VerifyPage />} />
          <Route path="/auth/verify-reset" element={<VerifyResetPage />} />
          <Route path="/auth/forgot-pass" element={<ForgotPassPage />} />
          <Route path="/auth/reset-pass" element={<ResetPassPage />} />
        </Route>
      </Route>
    </Route>,
  ),
);

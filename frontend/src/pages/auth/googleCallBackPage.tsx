import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const encodedInstitution = searchParams.get("institution");

    if (!token || !encodedInstitution) {
      navigate("/auth/login?error=Google login failed", { replace: true });
      return;
    }

    try {
      const institution = JSON.parse(atob(encodedInstitution));

      loginWithGoogle({ token, institution });
      navigate("/dashboard", { replace: true });
    } catch {
      navigate("/auth/login?error=Google login failed", { replace: true });
    }
  }, [searchParams, loginWithGoogle, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <p className="text-slate-500 text-sm">Signing you in...</p>
    </div>
  );
};

export default GoogleCallbackPage;

import React from "react";
import { Outlet } from "react-router-dom";
import { Particles } from "../components/ui/Particles";

export const AuthLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full font-sans text-slate-100 selection:bg-blue-500 selection:text-white overflow-x-hidden bg-[#090d16]">

      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <Particles
          particleCount={220}
          particleSpread={12}
          speed={0.15}
          alphaParticles={true}
          moveParticlesOnHover={true}
          particleHoverFactor={0.8}
          particleBaseSize={110}
          sizeRandomness={0.8}
          cameraDistance={20}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="relative z-10 min-h-screen w-full flex flex-col justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

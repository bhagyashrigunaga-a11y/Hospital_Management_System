import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_45%),linear-gradient(135deg,_#eff6ff,_#f8fafc)] p-4 dark:bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.24),_transparent_45%),linear-gradient(135deg,_#020617,_#0f172a)] sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}

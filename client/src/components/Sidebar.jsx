import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Doctors', to: '/doctors' },
  { label: 'Patients', to: '/patients' },
  { label: 'Appointments', to: '/appointments' },
  { label: 'Billing', to: '/billing' },
  { label: 'Prescriptions', to: '/prescriptions' },
  { label: 'Laboratory', to: '/laboratory' },
  { label: 'Pharmacy', to: '/pharmacy' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Profile', to: '/profile' },
  { label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-semibold text-white">H</div>
        <div>
          <p className="text-lg font-semibold">HospitalOS</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Care Management</p>
        </div>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

import React from 'react';
import { PanelCard } from '../components/Cards';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';

export default function Settings() {
  return (
    <div className="space-y-6">
      <PanelCard title="Preferences">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="font-semibold">Theme</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Switch between light and dark appearances instantly.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="font-semibold">Notifications</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Configure reminders and alerts for hospital tasks.</p>
          </div>
          <div className="flex gap-3">
            <PrimaryButton>Save Preferences</PrimaryButton>
            <SecondaryButton>Reset</SecondaryButton>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}

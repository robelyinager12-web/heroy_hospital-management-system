"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, User, Lock, CheckCircle2 } from "lucide-react";
import { settingsApi, Profile } from "@/features/settings/api/settings.api";
import { useAuthStore } from "@/store/auth-store";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["settings", "profile"],
    queryFn: async () => (await settingsApi.getProfile()).data.profile as Profile,
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone ?? "" });
    }
  }, [profile]);

  const profileMutation = useMutation({
    mutationFn: () => settingsApi.updateProfile(profileForm),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      if (accessToken) {
        setSession(
          { id: res.data.profile.id, firstName: res.data.profile.firstName, lastName: res.data.profile.lastName, role: profile!.role },
          accessToken
        );
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: () =>
      settingsApi.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
    onSuccess: () => {
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2500);
    },
  });

  const inputClass =
    "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mr-2" size={18} />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-cyan-400" />
          <h2 className="text-white font-semibold">Profile</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            profileMutation.mutate();
          }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="First name"
              value={profileForm.firstName}
              onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
              className={inputClass}
            />
            <input
              placeholder="Last name"
              value={profileForm.lastName}
              onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))}
              className={inputClass}
            />
          </div>
          <input value={profile?.email ?? ""} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
          <input
            placeholder="Phone"
            value={profileForm.phone}
            onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
            className={inputClass}
          />

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={profileMutation.isPending}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium disabled:opacity-50"
            >
              {profileMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
            {profileSaved && (
              <span className="flex items-center gap-1 text-sm text-emerald-400">
                <CheckCircle2 size={14} /> Saved
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-cyan-400" />
          <h2 className="text-white font-semibold">Change Password</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (passwordForm.newPassword !== passwordForm.confirmPassword) return;
            passwordMutation.mutate();
          }}
          className="space-y-3"
        >
          <input
            required
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
            className={inputClass}
          />
          <input
            required
            type="password"
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
            className={inputClass}
          />
          <input
            required
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            className={inputClass}
          />

          {passwordForm.newPassword &&
            passwordForm.confirmPassword &&
            passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="text-sm text-red-400">Passwords don't match</p>
            )}

          {passwordMutation.isError && (
            <p className="text-sm text-red-400">
              {(passwordMutation.error as any)?.message ?? "Something went wrong"}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={passwordMutation.isPending}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium disabled:opacity-50"
            >
              {passwordMutation.isPending ? "Updating..." : "Change Password"}
            </button>
            {passwordSaved && (
              <span className="flex items-center gap-1 text-sm text-emerald-400">
                <CheckCircle2 size={14} /> Password changed
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

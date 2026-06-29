import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../../services/userService'
import ProfileForm from '../../components/profile/ProfileForm'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function ProfilePage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getCurrentUser()
        if (!cancelled) setProfile(data)
      } catch (err) {
        if (!cancelled) setError(err.friendlyMessage || err.message || 'Failed to load profile')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function handleSave(values) {
    setSaving(true)
    try {
      const updated = await updateCurrentUser(values)
      setProfile(updated)
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
    setDeleting(true)
    try {
      await deleteCurrentUser()
      logout()
      navigate('/login')
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Failed to delete account')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Profile">
        <div className="text-text-secondary font-medium animate-pulse">Loading profile…</div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Profile">
        <div className="border border-error/20 bg-error/5 text-error px-4 py-3 rounded-lg text-sm font-medium">
          Error: {error}
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout title="Profile">
        <div className="text-text-secondary font-medium">No profile data found</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-xl space-y-6">
        {/* Profile Card */}
        <div className="border border-border bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider text-text-secondary">
            Personal Information
          </h2>
          <ProfileForm
            defaultValues={{
              name: profile.name,
              email: profile.email,
              occupation: profile.occupation ?? '',
              availableHours: profile.availableHours ?? '',
              workStyle: profile.workStyle ?? '',
            }}
            onSubmit={handleSave}
            onCancel={() => {}}
            submitting={saving}
          />
        </div>

        {/* Danger Zone */}
        <div className="border border-error/20 bg-error-50/20 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-error">Danger Zone</h3>
            <p className="text-xs text-text-muted mt-1 max-w-sm">
              Permanently delete your account and all associated data. This action is irreversible.
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 rounded-lg bg-error hover:bg-error/95 disabled:opacity-50 text-error-foreground font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-error/20 self-start sm:self-center"
          >
            {deleting ? 'Deleting…' : 'Delete Account'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
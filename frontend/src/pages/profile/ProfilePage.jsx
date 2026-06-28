import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getCurrentUser, updateCurrentUser, deleteCurrentUser } from '../../services/userService'
import ProfileForm from '../../components/profile/ProfileForm'

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

  if (loading) return <div>Loading…</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
  if (!profile) return <div>No profile data</div>

  return (
    <div>
      <h1>Profile</h1>

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

      <hr style={{ margin: '2rem 0' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: '0.5rem 1rem',
            background: '#c00',
            color: '#fff',
            border: 'none',
            borderRadius: '3px',
          }}
        >
          {deleting ? 'Deleting…' : 'Delete Account'}
        </button>
      </div>
    </div>
  )
}
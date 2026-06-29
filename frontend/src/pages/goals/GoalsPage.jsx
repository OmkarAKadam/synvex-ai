import { useEffect, useState } from 'react'
import {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
} from '../../services/goalService'
import GoalForm from '../../components/goals/GoalForm'
import GoalCard from '../../components/goals/GoalCard'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus } from 'lucide-react'

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const data = await getAllGoals()
        if (!cancelled) setGoals(data)
      } catch (err) {
        if (!cancelled) setError(err.friendlyMessage || err.message || 'Failed to load goals')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function handleCreate(values) {
    setSubmitting(true)
    try {
      const newGoal = await createGoal(values)
      setGoals(prev => [newGoal, ...prev])
      closeForm()
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Create failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(values) {
    setSubmitting(true)
    try {
      const updated = await updateGoal(editingGoal.id, values)
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? updated : g))
      closeForm()
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this goal?')) return
    try {
      await deleteGoal(id)
      setGoals(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Delete failed')
    }
  }

  async function handleProgress(id, progressPercentage) {
    try {
      const updated = await updateGoalProgress(id, progressPercentage)
      setGoals(prev => prev.map(g => g.id === id ? updated : g))
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Progress update failed')
    }
  }

  function openCreate() {
    setEditingGoal(null)
    setShowForm(true)
  }
  function openEdit(goal) {
    setEditingGoal(goal)
    setShowForm(true)
  }
  function closeForm() {
    setShowForm(false)
    setEditingGoal(null)
  }

  if (loading) {
    return (
      <DashboardLayout title="Goals">
        <div className="text-text-secondary font-medium animate-pulse">Loading goals…</div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Goals">
        <div className="border border-error/20 bg-error/5 text-error px-4 py-3 rounded-lg text-sm font-medium">
          Error: {error}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Goals">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-text-muted mt-0.5">Manage and track your primary objectives.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <Plus size={16} />
          New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12 border border-border border-dashed bg-surface/50 rounded-xl">
          <p className="text-sm text-text-secondary mb-4">No goals yet. Add one to get started.</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-text font-medium text-sm transition-colors shadow-xs"
          >
            <Plus size={14} />
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goals.map(g => (
            <GoalCard
              key={g.id}
              goal={g}
              onEdit={openEdit}
              onDelete={handleDelete}
              onProgressChange={handleProgress}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-overlay/40 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-border p-6 rounded-xl shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-scale-in">
            <h2 className="text-lg font-bold text-text mb-4 border-b border-border pb-3">
              {editingGoal ? 'Edit Goal' : 'Create Goal'}
            </h2>
            <GoalForm
              defaultValues={editingGoal ? {
                title: editingGoal.title,
                description: editingGoal.description,
                deadline: editingGoal.deadline,
                priority: editingGoal.priority,
              } : {}}
              onSubmit={editingGoal ? handleUpdate : handleCreate}
              onCancel={closeForm}
              submitting={submitting}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
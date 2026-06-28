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

  if (loading) return <div>Loading…</div>
  if (error) return <div style={{color:'red'}}>Error: {error}</div>

  return (
    <div>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
        <h1>Goals</h1>
        <button onClick={openCreate}>+ New Goal</button>
      </header>

      {goals.length === 0 ? (
        <p>No goals yet. Click “New Goal” to add one.</p>
      ) : (
        <div>
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
        <div style={{
          position:'fixed', top:0, left:0, right:0, bottom:0,
          background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000
        }}>
          <div style={{background:'#fff', padding:'1.5rem', borderRadius:'6px', width:'100%', maxWidth:'520px', maxHeight:'90vh', overflow:'auto'}}>
            <h2>{editingGoal ? 'Edit Goal' : 'Create Goal'}</h2>
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
    </div>
  )
}
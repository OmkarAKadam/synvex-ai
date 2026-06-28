import { useEffect, useState } from 'react'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../../services/taskService'
import { getAllGoals } from '../../services/goalService'
import TaskForm from '../../components/tasks/TaskForm'
import TaskCard from '../../components/tasks/TaskCard'

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Load tasks + goals on mount
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [tasksData, goalsData] = await Promise.all([getAllTasks(), getAllGoals()])
        if (!cancelled) {
          setTasks(tasksData)
          setGoals(goalsData)
        }
      } catch (err) {
        if (!cancelled) setError(err.friendlyMessage || err.message || 'Failed to load data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  // Handlers
  async function handleCreate(values) {
    setSubmitting(true)
    try {
      const newTask = await createTask(values)
      setTasks(prev => [newTask, ...prev])
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
      const updated = await updateTask(editingTask.id, values)
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t))
      closeForm()
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      setTasks(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Delete failed')
    }
  }

  async function handleStatusChange(id, status) {
    try {
      const updated = await updateTaskStatus(id, status)
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Status update failed')
    }
  }

  function openCreate() {
    setEditingTask(null)
    setShowForm(true)
  }

  function openEdit(task) {
    setEditingTask(task)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingTask(null)
  }

  // Render
  if (loading) return <div>Loading…</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>Tasks</h1>
        <button onClick={openCreate} style={{ padding: '0.5rem 1rem' }}>
          + New Task
        </button>
      </header>

      {tasks.length === 0 ? (
        <p>No tasks yet. Click “New Task” to add one.</p>
      ) : (
        <div>
          {tasks.map(t => (
            <TaskCard
              key={t.id}
              task={t}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Modal wrapper */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '6px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <h2>{editingTask ? 'Edit Task' : 'Create Task'}</h2>
            <TaskForm
              defaultValues={editingTask
                ? {
                    // goalId omitted on edit – backend ignores it
                    title: editingTask.title,
                    description: editingTask.description ?? '',
                    estimatedHours: editingTask.estimatedHours ?? '',
                    priority: editingTask.priority,
                    dueDate: editingTask.dueDate, // already ISO string
                  }
                : {}}
              onSubmit={editingTask ? handleUpdate : handleCreate}
              onCancel={closeForm}
              submitting={submitting}
              goals={goals}
              isEditing={!!editingTask}
            />
          </div>
        </div>
      )}
    </div>
  )
}
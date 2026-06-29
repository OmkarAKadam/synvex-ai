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
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Plus } from 'lucide-react'

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
  if (loading) {
    return (
      <DashboardLayout title="Tasks">
        <div className="text-text-secondary font-medium animate-pulse">Loading tasks…</div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Tasks">
        <div className="border border-error/20 bg-error/5 text-error px-4 py-3 rounded-lg text-sm font-medium">
          Error: {error}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Tasks">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-text-muted mt-0.5">Manage and track your operational items.</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-hover transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 border border-border border-dashed bg-surface/50 rounded-xl">
          <p className="text-sm text-text-secondary mb-4">No tasks yet. Add one to get started.</p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-text font-medium text-sm transition-colors shadow-xs"
          >
            <Plus size={14} />
            Create Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
        <div className="fixed inset-0 bg-overlay/40 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface border border-border p-6 rounded-xl shadow-md w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-scale-in">
            <h2 className="text-lg font-bold text-text mb-4 border-b border-border pb-3">
              {editingTask ? 'Edit Task' : 'Create Task'}
            </h2>
            <TaskForm
              defaultValues={editingTask
                ? {
                    title: editingTask.title,
                    description: editingTask.description ?? '',
                    estimatedHours: editingTask.estimatedHours ?? '',
                    priority: editingTask.priority,
                    dueDate: editingTask.dueDate,
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
    </DashboardLayout>
  )
}
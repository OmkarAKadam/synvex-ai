import { useEffect, useState, useMemo } from 'react'
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../../services/taskService'
import { getAllGoals } from '../../services/goalService'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'
import TaskForm from '../../components/tasks/TaskForm'
import TaskCard from '../../components/tasks/TaskCard'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'
import { Plus, Search, ClipboardList, Circle, Play, CheckSquare, ArrowUpDown } from 'lucide-react'

const statusFilters = [
  { key: 'all', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'SKIPPED', label: 'Skipped' },
]

const sortOptions = [
  { key: 'dueDate', label: 'Due Date' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status' },
  { key: 'title', label: 'Name' },
]

const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
const statusOrder = { PENDING: 0, IN_PROGRESS: 1, COMPLETED: 2, SKIPPED: 3 }

export default function TasksPage() {
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const [tasksData, goalsData] = await Promise.all([getAllTasks(), getAllGoals()])
      setTasks(tasksData)
      setGoals(goalsData)
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function retryLoad() {
    load()
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const pending = tasks.filter(t => t.status === 'PENDING').length
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
    const completed = tasks.filter(t => t.status === 'COMPLETED').length
    return { total, pending, inProgress, completed }
  }, [tasks])

  const statusCounts = useMemo(() => {
    const counts = { all: tasks.length }
    for (const t of tasks) {
      counts[t.status] = (counts[t.status] || 0) + 1
    }
    return counts
  }, [tasks])

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate)
        if (sortBy === 'priority') return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
        if (sortBy === 'status') return (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        return 0
      })
  }, [tasks, search, statusFilter, sortBy])

  async function handleCreate(values) {
    setSubmitting(true)
    setFormError(null)
    try {
      const newTask = await createTask(values)
      setTasks(prev => [newTask, ...prev])
      closeForm()
    } catch (err) {
      setFormError(err.friendlyMessage || err.message || 'Create failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(values) {
    setSubmitting(true)
    setFormError(null)
    try {
      const updated = await updateTask(editingTask.id, values)
      setTasks(prev => prev.map(t => t.id === editingTask.id ? updated : t))
      closeForm()
    } catch (err) {
      setFormError(err.friendlyMessage || err.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  function handleDelete(id) {
    const task = tasks.find(t => t.id === id)
    if (task) {
      setDeleteTarget(task)
      setDeleteError(null)
    }
  }

  function closeDeleteModal() {
    setDeleteTarget(null)
    setDeleteError(null)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteTask(deleteTarget.id)
      setTasks(prev => prev.filter(t => t.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(err.friendlyMessage || err.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  async function handleStatusChange(id, status) {
    const updated = await updateTaskStatus(id, status)
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
  }

  function openCreate() {
    setEditingTask(null)
    setShowForm(true)
    setFormError(null)
  }

  function openEdit(task) {
    setEditingTask(task)
    setShowForm(true)
    setFormError(null)
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setSortBy('dueDate')
  }

  function closeForm() {
    setShowForm(false)
    setEditingTask(null)
    setFormError(null)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="space-y-2">
              <div className="h-8 w-32 bg-border rounded" />
              <div className="h-4 w-56 bg-border rounded" />
            </div>
            <div className="h-10 w-28 bg-border rounded-lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-card shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-20 bg-border rounded" />
                    <div className="h-8 w-16 bg-border rounded" />
                  </div>
                  <div className="h-10 w-10 bg-border rounded-lg" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="sm:w-64 h-10 bg-border rounded-lg" />
            <div className="flex gap-1.5 flex-1">
              <div className="h-10 w-20 bg-border rounded-lg" />
              <div className="h-10 w-28 bg-border rounded-lg" />
              <div className="h-10 w-24 bg-border rounded-lg" />
              <div className="h-10 w-20 bg-border rounded-lg" />
              <div className="h-10 w-20 bg-border rounded-lg" />
            </div>
            <div className="h-10 w-32 bg-border rounded-lg shrink-0" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-card shadow-sm p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-5 w-3/4 bg-border rounded" />
                  <div className="h-5 w-20 bg-border rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-border rounded" />
                  <div className="h-4 w-2/3 bg-border rounded" />
                </div>
                <div className="flex gap-4">
                  <div className="h-4 w-20 bg-border rounded" />
                  <div className="h-4 w-16 bg-border rounded" />
                  <div className="h-4 w-24 bg-border rounded" />
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border/60">
                  <div className="h-8 w-16 bg-border rounded-lg" />
                  <div className="h-8 w-20 bg-border rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto mt-8">
          <Alert variant="error" className="w-full">
            {error}
          </Alert>
          <Button onClick={retryLoad}>Retry</Button>
        </div>
      </DashboardLayout>
    )
  }

  const hasNoTasks = tasks.length === 0
  const hasNoMatches = !hasNoTasks && filteredTasks.length === 0

  const summaryCards = [
    { label: 'Total Tasks', value: stats.total, icon: ClipboardList, iconBg: 'bg-primary/10 text-primary' },
    { label: 'Pending', value: stats.pending, icon: Circle, iconBg: 'bg-warning/10 text-warning' },
    { label: 'In Progress', value: stats.inProgress, icon: Play, iconBg: 'bg-info/10 text-info' },
    { label: 'Completed', value: stats.completed, icon: CheckSquare, iconBg: 'bg-success/10 text-success' },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Tasks</h1>
          <p className="text-sm text-text-muted mt-1">Manage and track your operational items.</p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus size={16} />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryCards.map(card => {
          const Icon = card.icon
          return (
            <Card key={card.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">{card.label}</p>
                  <p className="text-3xl font-bold mt-1.5 tracking-tight text-text">{card.value}</p>
                </div>
                <div className={`p-2 rounded-lg border border-border/40 ${card.iconBg}`}>
                  <Icon size={18} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="sm:w-64">
          <Input
            placeholder="Search tasks…"
            rightIcon={<Search size={16} />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto flex-1 min-w-0">
          {statusFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors
                ${statusFilter === f.key
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-surface text-text-secondary border-border hover:bg-surface-elevated hover:text-text'
                }`}
            >
              {f.label}{statusCounts[f.key] !== undefined ? ` (${statusCounts[f.key]})` : ''}
            </button>
          ))}
        </div>
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg border border-border bg-surface text-sm text-text-secondary font-medium cursor-pointer hover:bg-surface-elevated transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {sortOptions.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <ArrowUpDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      {hasNoTasks ? (
        <div className="text-center py-12 border border-border border-dashed bg-surface/50 rounded-xl">
          <ClipboardList size={40} className="mx-auto mb-4 text-text-muted" />
          <p className="text-sm text-text-secondary mb-1">No tasks yet</p>
          <p className="text-xs text-text-muted mb-4">Create your first task to start tracking work.</p>
          <Button variant="secondary" onClick={openCreate}>
            <Plus size={14} />
            Create Task
          </Button>
        </div>
      ) : hasNoMatches ? (
        <div className="text-center py-12">
          <Search size={32} className="mx-auto mb-3 text-text-muted" />
          <p className="text-sm text-text-secondary mb-1">No tasks found</p>
          <p className="text-xs text-text-muted mb-4">Try clearing your filters or changing your search.</p>
          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map(t => (
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

      <Modal isOpen={showForm} onClose={closeForm} ariaLabel={editingTask ? 'Edit Task' : 'Create Task'}>
        <Card>
          <Card.Header>
            <Card.Title>{editingTask ? 'Edit Task' : 'Create Task'}</Card.Title>
          </Card.Header>
          <Card.Body>
            {formError && <Alert variant="error" className="mb-4">{formError}</Alert>}
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
          </Card.Body>
        </Card>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={closeDeleteModal} ariaLabel="Delete task">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text">Delete Task</h3>
          <p className="text-sm text-text-secondary mt-2">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-text">{deleteTarget?.title}</span>?
            This action cannot be undone.
          </p>
          {deleteError && <Alert variant="error" className="mt-4">{deleteError}</Alert>}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60 mt-6">
            <Button variant="secondary" onClick={closeDeleteModal} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

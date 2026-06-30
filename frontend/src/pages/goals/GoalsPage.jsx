import { useEffect, useState, useMemo } from 'react'
import {
  getAllGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
} from '../../services/goalService'
import Modal from '../../components/ui/Modal'
import Card from '../../components/ui/Card'
import GoalForm from '../../components/goals/GoalForm'
import GoalCard from '../../components/goals/GoalCard'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { Plus, Search, Target, Play, CheckSquare, TrendingUp, ArrowUpDown } from 'lucide-react'

const statusFilters = [
  { key: 'all', label: 'All' },
  { key: 'NOT_STARTED', label: 'Not Started' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
]

const sortOptions = [
  { key: 'deadline', label: 'Deadline' },
  { key: 'priority', label: 'Priority' },
  { key: 'progress', label: 'Progress' },
  { key: 'title', label: 'Name' },
]

const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }

export default function GoalsPage() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)
  const [formError, setFormError] = useState(null)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('deadline')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllGoals()
      setGoals(data)
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Failed to load goals')
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
    const total = goals.length
    const active = goals.filter(g => g.status !== 'COMPLETED').length
    const completed = goals.filter(g => g.status === 'COMPLETED').length
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, active, completed, rate }
  }, [goals])

  const statusCounts = useMemo(() => {
    const counts = { all: goals.length }
    for (const g of goals) {
      counts[g.status] = (counts[g.status] || 0) + 1
    }
    return counts
  }, [goals])

  const filteredGoals = useMemo(() => {
    return goals
      .filter(g => {
        if (statusFilter !== 'all' && g.status !== statusFilter) return false
        if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline)
        if (sortBy === 'priority') return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
        if (sortBy === 'progress') return b.progressPercentage - a.progressPercentage
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        return 0
      })
  }, [goals, search, statusFilter, sortBy])

  async function handleCreate(values) {
    setSubmitting(true)
    setFormError(null)
    try {
      const newGoal = await createGoal(values)
      setGoals(prev => [newGoal, ...prev])
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
      const updated = await updateGoal(editingGoal.id, values)
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? updated : g))
      closeForm()
    } catch (err) {
      setFormError(err.friendlyMessage || err.message || 'Update failed')
    } finally {
      setSubmitting(false)
    }
  }

  function handleDelete(id) {
    const goal = goals.find(g => g.id === id)
    if (goal) {
      setDeleteTarget(goal)
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
      await deleteGoal(deleteTarget.id)
      setGoals(prev => prev.filter(g => g.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setDeleteError(err.friendlyMessage || err.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  async function handleProgress(id, progressPercentage) {
    const updated = await updateGoalProgress(id, progressPercentage)
    setGoals(prev => prev.map(g => g.id === id ? updated : g))
  }

  function openCreate() {
    setEditingGoal(null)
    setShowForm(true)
    setFormError(null)
  }
  function openEdit(goal) {
    setEditingGoal(goal)
    setShowForm(true)
    setFormError(null)
  }
  function closeForm() {
    setShowForm(false)
    setEditingGoal(null)
    setFormError(null)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="space-y-2">
              <div className="h-8 w-32 bg-border rounded" />
              <div className="h-4 w-56 bg-border rounded" />
            </div>
            <div className="h-10 w-28 bg-border rounded-lg" />
          </div>

          {/* Summary cards skeleton */}
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

          {/* Search/filter bar skeleton */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="sm:w-64 h-10 bg-border rounded-lg" />
            <div className="flex gap-1.5 flex-1">
              <div className="h-10 w-24 bg-border rounded-lg" />
              <div className="h-10 w-28 bg-border rounded-lg" />
              <div className="h-10 w-20 bg-border rounded-lg" />
              <div className="h-10 w-24 bg-border rounded-lg" />
            </div>
            <div className="h-10 w-32 bg-border rounded-lg shrink-0" />
          </div>

          {/* Goal cards skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-card shadow-sm p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-5 w-3/4 bg-border rounded" />
                  <div className="h-2 w-2 bg-border rounded-full" />
                </div>
                <div className="flex gap-1.5">
                  <div className="h-5 w-20 bg-border rounded-full" />
                  <div className="h-5 w-16 bg-border rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-border rounded" />
                  <div className="h-4 w-2/3 bg-border rounded" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-16 bg-border rounded" />
                    <div className="h-3 w-8 bg-border rounded" />
                  </div>
                  <div className="h-2 w-full bg-border rounded-full" />
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

  const hasNoGoals = goals.length === 0
  const hasNoMatches = !hasNoGoals && filteredGoals.length === 0

  const summaryCards = [
    { label: 'Total Goals', value: stats.total, icon: Target, iconBg: 'bg-primary/10 text-primary' },
    { label: 'Active Goals', value: stats.active, icon: Play, iconBg: 'bg-info/10 text-info' },
    { label: 'Completed Goals', value: stats.completed, icon: CheckSquare, iconBg: 'bg-success/10 text-success' },
    { label: 'Completion Rate', value: `${stats.rate}%`, icon: TrendingUp, iconBg: 'bg-accent/10 text-accent' },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text">Goals</h1>
          <p className="text-sm text-text-muted mt-1">Manage and track your primary objectives.</p>
        </div>
        <Button onClick={openCreate} className="shrink-0">
          <Plus size={16} />
          New Goal
        </Button>
      </div>

      {/* Summary Cards */}
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

      {/* Search + Filters + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="sm:w-64">
          <Input
            placeholder="Search goals…"
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

      {/* Goal Grid or Empty State */}
      {hasNoGoals ? (
        <div className="text-center py-12 border border-border border-dashed bg-surface/50 rounded-xl">
          <Target size={40} className="mx-auto mb-4 text-text-muted" />
          <p className="text-sm text-text-secondary mb-1">No goals yet</p>
          <p className="text-xs text-text-muted mb-4">Create your first goal to start tracking progress.</p>
          <Button variant="secondary" onClick={openCreate}>
            <Plus size={14} />
            Create Goal
          </Button>
        </div>
      ) : hasNoMatches ? (
        <div className="text-center py-12">
          <Search size={32} className="mx-auto mb-3 text-text-muted" />
          <p className="text-sm text-text-secondary mb-1">No goals found</p>
          <p className="text-xs text-text-muted">Try clearing your filters or changing your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredGoals.map(g => (
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

      <Modal isOpen={showForm} onClose={closeForm} ariaLabel={editingGoal ? 'Edit Goal' : 'Create Goal'}>
        <Card>
          <Card.Header>
            <Card.Title>{editingGoal ? 'Edit Goal' : 'Create Goal'}</Card.Title>
          </Card.Header>
          <Card.Body>
            {formError && <Alert variant="error" className="mb-4">{formError}</Alert>}
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
          </Card.Body>
        </Card>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={closeDeleteModal} ariaLabel="Delete goal">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text">Delete Goal</h3>
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
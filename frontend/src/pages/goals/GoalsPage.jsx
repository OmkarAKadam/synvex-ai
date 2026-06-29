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

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('deadline')

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
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center gap-2">
          <Spinner size="md" />
          <span className="text-text-secondary font-medium">Loading goals…</span>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="error" className="max-w-md mx-auto mt-8">
          {error}
        </Alert>
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
          <p className="text-sm text-text-secondary mb-4">No goals yet. Add one to get started.</p>
          <Button variant="secondary" onClick={openCreate}>
            <Plus size={14} />
            Create Goal
          </Button>
        </div>
      ) : hasNoMatches ? (
        <div className="text-center py-12">
          <p className="text-sm text-text-muted">No goals match your filters.</p>
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
    </DashboardLayout>
  )
}
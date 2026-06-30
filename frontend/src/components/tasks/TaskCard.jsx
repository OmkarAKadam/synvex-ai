import { useState, useRef, useEffect } from 'react'
import { Clock } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const statusValues = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']

const statusLabel = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  SKIPPED: 'Skipped',
}

const statusVariant = {
  COMPLETED: 'success',
  IN_PROGRESS: 'info',
  PENDING: 'neutral',
  SKIPPED: 'neutral',
}

const priorityLabel = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

const priorityVariant = {
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'neutral',
}

function calcUrgency(task) {
  if (!task.dueDate) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const due = new Date(task.dueDate + 'T00:00:00')
  due.setHours(0, 0, 0, 0)

  if (now > due) {
    const daysOver = Math.round((now - due) / (1000 * 60 * 60 * 24))
    return { label: `Overdue by ${daysOver} day${daysOver !== 1 ? 's' : ''}`, variant: 'error', pct: 100 }
  }

  if (now.getTime() === due.getTime()) {
    return { label: 'Due today', variant: 'warning', pct: 100 }
  }

  if (!task.createdAt) {
    const diffDays = Math.round((due - now) / (1000 * 60 * 60 * 24))
    const label = diffDays === 1 ? 'Tomorrow' : `${diffDays} days left`
    const variant = diffDays <= 3 ? 'warning' : diffDays <= 7 ? 'info' : 'neutral'
    return { label, variant, pct: 0 }
  }

  const createdAt = new Date(task.createdAt)
  createdAt.setHours(0, 0, 0, 0)
  const totalMs = due.getTime() - createdAt.getTime()
  if (totalMs <= 0) {
    return { label: 'Due today', variant: 'warning', pct: 100 }
  }

  const elapsedMs = now.getTime() - createdAt.getTime()
  const pct = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)))
  const remainingPct = 100 - pct

  let variant
  if (remainingPct > 50) variant = 'neutral'
  else if (remainingPct > 25) variant = 'info'
  else if (remainingPct > 10) variant = 'warning'
  else variant = 'error'

  const label = remainingPct === 0 ? 'Due today' : `${remainingPct}% time left`

  return { label, variant, pct }
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [status, setStatus] = useState(task.status)
  const [savingStatus, setSavingStatus] = useState(false)
  const [statusSuccess, setStatusSuccess] = useState(false)
  const [statusError, setStatusError] = useState(null)
  const successTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    }
  }, [])

  async function handleStatusSave() {
    if (status === task.status) return
    setSavingStatus(true)
    setStatusError(null)
    setStatusSuccess(false)
    try {
      await onStatusChange(task.id, status)
      setStatusSuccess(true)
      successTimeoutRef.current = setTimeout(() => setStatusSuccess(false), 1000)
    } catch (err) {
      setStatusError(err.message || 'Failed to update status')
    } finally {
      setSavingStatus(false)
    }
  }

  const urgency = calcUrgency(task)
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

  const barColor = urgency?.variant === 'error' ? 'bg-error' : urgency?.variant === 'warning' ? 'bg-warning' : urgency?.variant === 'info' ? 'bg-info' : 'bg-border'
  const labelColor = urgency?.variant === 'error' ? 'text-error' : urgency?.variant === 'warning' ? 'text-warning' : urgency?.variant === 'info' ? 'text-info' : 'text-text-secondary'

  return (
    <Card className="flex flex-col justify-between space-y-4 hover:-translate-y-0.5 hover:shadow-md transition-transform transition-shadow duration-150">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-text truncate">{task.title}</h3>
        <Badge variant={statusVariant[task.status] || 'neutral'}>{statusLabel[task.status] || task.status}</Badge>
      </div>

      {task.description && (
        <p className="text-sm text-text-secondary line-clamp-2">{task.description}</p>
      )}

      {urgency && (
        <div className="space-y-1.5 pt-2 border-t border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Due {fmtDate(task.dueDate)}</span>
            <span className={`text-xs font-semibold ${labelColor}`}>{urgency.label}</span>
          </div>
          <div className="h-1 bg-border/50 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${barColor} transition-all duration-300`} style={{ width: `${urgency.pct}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-text-secondary font-medium">
        <span className="flex items-center gap-1">
          Priority:
          <Badge type="chip" variant={priorityVariant[task.priority] || 'neutral'}>{priorityLabel[task.priority] || task.priority}</Badge>
        </span>
        {task.estimatedHours != null && (
          <span className="inline-flex items-center gap-1">
            <Clock size={14} className="text-text-secondary" />
            {task.estimatedHours} hr{task.estimatedHours !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
          Status:
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            disabled={savingStatus}
            className="px-2 py-1 rounded bg-bg border border-border text-xs text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {statusValues.map(s => (
              <option key={s} value={s}>{statusLabel[s] || s}</option>
            ))}
          </select>
        </label>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleStatusSave}
          disabled={savingStatus || status === task.status}
        >
          {savingStatus ? 'Saving…' : statusSuccess ? '✓ Updated' : 'Update'}
        </Button>
        {statusError && (
          <span className="text-xs text-error font-medium ml-1">{statusError}</span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <Button size="sm" variant="ghost" onClick={() => onEdit(task)}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(task.id)}>Delete</Button>
      </div>
    </Card>
  )
}

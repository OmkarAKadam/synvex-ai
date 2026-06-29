import { useState } from 'react'

const statusValues = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED']

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [status, setStatus] = useState(task.status)
  const [savingStatus, setSavingStatus] = useState(false)

  async function handleStatusSave() {
    if (status === task.status) return
    setSavingStatus(true)
    try {
      await onStatusChange(task.id, status)
    } finally {
      setSavingStatus(false)
    }
  }

  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString() : '—'
  const fmtDateTime = (iso) => iso ? new Date(iso).toLocaleString() : '—'

  return (
    <div className="border border-border bg-surface rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-text truncate">{task.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border whitespace-nowrap
            ${task.status === 'COMPLETED'
              ? 'bg-success-50 text-success border-success/20'
              : task.status === 'IN_PROGRESS'
              ? 'bg-info-50 text-info border-info/20'
              : 'bg-surface-elevated text-text-secondary border-border/80'}`}>
            {task.status}
          </span>
        </div>
        {task.description && <p className="text-sm text-text-secondary mt-1.5 line-clamp-2">{task.description}</p>}

        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-text-muted font-medium">
          <div>
            <span className="text-text-secondary">Est. Hours:</span> {task.estimatedHours ?? '—'}
          </div>
          <div>
            <span className="text-text-secondary">Priority:</span>{' '}
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold
              ${task.priority === 'HIGH' ? 'bg-error-50 text-error border-error/20' : task.priority === 'MEDIUM' ? 'bg-warning-50 text-warning border-warning/20' : 'bg-surface-elevated text-text-secondary border-border/80'}`}>
              {task.priority}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Due:</span> {fmtDate(task.dueDate)}
          </div>
          {task.completedAt && (
            <div>
              <span className="text-text-secondary">Completed:</span> {fmtDateTime(task.completedAt)}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
          Status:
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="px-2 py-1 rounded bg-bg border border-border text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            {statusValues.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleStatusSave}
            disabled={savingStatus || status === task.status}
            className="px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-elevated disabled:opacity-50 text-xs font-semibold text-text-secondary transition-colors"
          >
            {savingStatus ? 'Saving…' : 'Update'}
          </button>
        </label>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={() => onEdit(task)}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-semibold text-text-secondary transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1.5 rounded-lg bg-error hover:bg-error/95 text-xs font-semibold text-error-foreground transition-colors shadow-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
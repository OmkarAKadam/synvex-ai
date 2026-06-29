import { useState } from 'react'

export default function GoalCard({ goal, onEdit, onDelete, onProgressChange }) {
  const [progress, setProgress] = useState(goal.progressPercentage)
  const [savingProgress, setSavingProgress] = useState(false)

  async function handleProgressSave() {
    setSavingProgress(true)
    try {
      await onProgressChange(goal.id, progress)
    } finally {
      setSavingProgress(false)
    }
  }

  return (
    <div className="border border-border bg-surface rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-text truncate">{goal.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border whitespace-nowrap
            ${goal.status === 'COMPLETED' ? 'bg-success-50 text-success border-success/20' : 'bg-info-50 text-info border-info/20'}`}>
            {goal.status}
          </span>
        </div>
        <p className="text-sm text-text-secondary mt-1.5 line-clamp-2">{goal.description}</p>
        
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 text-xs text-text-muted font-medium">
          <div>
            <span className="text-text-secondary">Deadline:</span> {goal.deadline}
          </div>
          <div>
            <span className="text-text-secondary">Priority:</span>{' '}
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold
              ${goal.priority === 'HIGH' ? 'bg-error-50 text-error border-error/20' : goal.priority === 'MEDIUM' ? 'bg-warning-50 text-warning border-warning/20' : 'bg-surface-elevated text-text-secondary border-border/80'}`}>
              {goal.priority}
            </span>
          </div>
          {goal.riskLevel && (
            <div>
              <span className="text-text-secondary">Risk:</span>{' '}
              <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold
                ${goal.riskLevel === 'HIGH' ? 'bg-error-50 text-error border-error/20' : goal.riskLevel === 'MEDIUM' ? 'bg-warning-50 text-warning border-warning/20' : 'bg-success-50 text-success border-success/20'}`}>
                {goal.riskLevel}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
          Progress:
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={e => setProgress(Number(e.target.value))}
            className="w-24 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <output className="w-8 text-right font-bold text-text-secondary">{progress}%</output>
        </label>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleProgressSave}
            disabled={savingProgress || progress === goal.progressPercentage}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated disabled:opacity-50 text-xs font-semibold text-text-secondary transition-colors"
          >
            {savingProgress ? 'Saving…' : 'Update'}
          </button>
          <button
            onClick={() => onEdit(goal)}
            className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-xs font-semibold text-text-secondary transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="px-3 py-1.5 rounded-lg bg-error hover:bg-error/95 text-xs font-semibold text-error-foreground transition-colors shadow-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
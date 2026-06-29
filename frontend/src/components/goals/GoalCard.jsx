import { useState } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import DeadlineBar from './DeadlineBar'

const statusVariant = {
  COMPLETED: 'success',
  IN_PROGRESS: 'info',
  NOT_STARTED: 'neutral',
}

const statusDot = {
  COMPLETED: 'bg-success',
  IN_PROGRESS: 'bg-info',
  NOT_STARTED: 'bg-text-muted',
}

const priorityVariant = {
  HIGH: 'error',
  MEDIUM: 'warning',
  LOW: 'neutral',
}

const riskVariant = {
  HIGH: 'error',
  MEDIUM: 'warning',
  ON_TRACK: 'success',
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

function calcDeadline(goal) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const start = goal.createdAt ? new Date(goal.createdAt) : new Date()
  start.setHours(0, 0, 0, 0)

  const deadline = new Date(goal.deadline + 'T00:00:00')
  deadline.setHours(0, 0, 0, 0)

  const totalMs = deadline.getTime() - start.getTime()
  const elapsedMs = now.getTime() - start.getTime()
  const deadlineFromNowMs = deadline.getTime() - now.getTime()

  const totalDays = Math.max(1, Math.round(totalMs / MS_PER_DAY))
  const elapsedDays = Math.max(0, Math.floor(elapsedMs / MS_PER_DAY))
  const remainingDays = Math.max(0, Math.ceil(deadlineFromNowMs / MS_PER_DAY))
  const overdueDays = Math.max(0, Math.round(-deadlineFromNowMs / MS_PER_DAY))
  const isOverdue = deadlineFromNowMs < 0
  const reaperPercent = Math.min(100, Math.round((elapsedDays / totalDays) * 100))

  return { reaperPercent, isOverdue, overdueDays, remainingDays }
}

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

  const deadline = calcDeadline(goal)
  const deadlineLabel = new Date(goal.deadline + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="flex flex-col justify-between space-y-4 hover:-translate-y-0.5 hover:shadow-md transition-transform transition-shadow duration-150">
      {/* Title + Status Indicator */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-text truncate">{goal.title}</h3>
        <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${statusDot[goal.status] || 'bg-text-muted'}`} />
      </div>

      {/* Badge Row */}
      <div className="flex items-center flex-wrap gap-1.5">
        <Badge variant={statusVariant[goal.status] || 'neutral'}>{goal.status}</Badge>
        <Badge type="chip" variant={priorityVariant[goal.priority] || 'neutral'}>{goal.priority}</Badge>
        {goal.riskLevel && (
          <Badge type="chip" variant={riskVariant[goal.riskLevel] || 'neutral'}>{goal.riskLevel}</Badge>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary line-clamp-2">{goal.description}</p>

      {/* Progress Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary">Progress</span>
          <span className="text-xs font-bold text-text-secondary">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
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
          <Button
            size="sm"
            variant="secondary"
            onClick={handleProgressSave}
            disabled={savingProgress || progress === goal.progressPercentage}
          >
            {savingProgress ? 'Saving…' : 'Update'}
          </Button>
        </div>
      </div>

      {/* Deadline Timeline */}
      <DeadlineBar
        key={`${goal.createdAt}-${goal.deadline}`}
        percent={deadline.reaperPercent}
        isOverdue={deadline.isOverdue}
        remainingDays={deadline.remainingDays}
        overdueDays={deadline.overdueDays}
        deadlineLabel={deadlineLabel}
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/60">
        <Button size="sm" variant="ghost" onClick={() => onEdit(goal)}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => onDelete(goal.id)}>Delete</Button>
      </div>
    </Card>
  )
}

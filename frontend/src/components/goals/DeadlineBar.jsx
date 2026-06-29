import { useEffect, useState } from 'react'
import { Flag } from 'lucide-react'

function GrimReaperIcon({ size = 16, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 4a8 8 0 0 0-8 8c0 3 1 5 2 7" />
      <path d="M12 4a8 8 0 0 1 8 8c0 3-1 5-2 7" />
      <path d="M6 19c2 1 4 2 6 2s4-1 6-2" />
      <line x1="18" y1="5" x2="22" y2="1" />
      <path d="M22 1c-2 1-3 3-1 5" />
    </svg>
  )
}

function getUrgencyColor(pct, isOverdue) {
  if (isOverdue || pct >= 85) return 'var(--color-error)'
  if (pct >= 60) return 'var(--color-warning)'
  return 'var(--color-border)'
}

export default function DeadlineBar({ percent, isOverdue, remainingDays, overdueDays, deadlineLabel }) {
  const [animPercent, setAnimPercent] = useState(0)

  useEffect(() => {
    setAnimPercent(percent)
  }, [percent])

  const CLAMP = 5
  const reaperLeft = Math.max(CLAMP, Math.min(100 - CLAMP, animPercent))
  const fillColor = getUrgencyColor(percent, isOverdue)

  const labelText = isOverdue
    ? `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`
    : remainingDays === 0
      ? 'Due today'
      : `${remainingDays} day${remainingDays !== 1 ? 's' : ''} left`

  const labelColor = isOverdue
    ? 'text-error'
    : remainingDays === 0
      ? 'text-warning'
      : 'text-text-secondary'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-text-secondary">Deadline</span>
      </div>

      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1.5 bg-border/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${reaperLeft}%`,
              backgroundColor: fillColor,
              transition: 'width 700ms ease-out, background-color 700ms ease-out',
            }}
          />
        </div>

        <div
          className="absolute top-0"
          style={{ left: `${reaperLeft}%`, transform: 'translateX(-50%)', transition: 'left 700ms ease-out' }}
        >
          <GrimReaperIcon size={16} className={isOverdue || percent >= 85 ? 'text-error' : 'text-text-secondary'} />
        </div>

        <div className="absolute top-0" style={{ left: '100%', transform: 'translateX(-50%)' }}>
          <Flag size={14} className="text-text-muted" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${labelColor}`}>{labelText}</span>
        <span className="text-xs text-text-muted">Due {deadlineLabel}</span>
      </div>
    </div>
  )
}

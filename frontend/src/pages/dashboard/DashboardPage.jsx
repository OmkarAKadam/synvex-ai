import { useEffect, useState } from 'react'
import { getDashboard } from '../../services/dashboardService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Calendar, Target, CheckSquare, BarChart2 } from 'lucide-react'

function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const result = await getDashboard()
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.friendlyMessage || err.message || 'Failed to load dashboard')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-secondary font-medium animate-pulse">Loading dashboard…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="border border-error/20 bg-error/5 text-error px-4 py-3 rounded-lg text-sm font-medium max-w-md w-full">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-secondary font-medium">No dashboard data found</div>
      </div>
    )
  }

  const metrics = [
    { label: 'Total Goals', value: data.totalGoals, description: `${data.activeGoals} active / ${data.completedGoals} done`, icon: Target },
    { label: 'Total Tasks', value: data.totalTasks, description: `${data.pendingTasks} pending / ${data.completedTasks} done`, icon: CheckSquare },
    { label: 'Today\'s Tasks', value: data.todayTasks, description: 'Tasks due today', icon: Calendar },
    { label: 'Productivity Score', value: `${data.productivityScore}%`, description: 'Overall completion rate', icon: BarChart2 },
  ]

  return (
    <DashboardLayout title="Dashboard">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="border border-border bg-surface rounded-xl p-5 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">{metric.label}</p>
                <p className="text-3xl font-bold mt-1.5 tracking-tight text-text">{metric.value}</p>
                <p className="text-xs text-text-muted mt-1.5">{metric.description}</p>
              </div>
              <div className="p-2 rounded-lg bg-surface-elevated text-text-secondary border border-border/40">
                <Icon size={18} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Two Column Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Goals */}
        <div className="border border-border bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
            <Target size={16} className="text-primary" />
            Recent Goals
          </h2>
          {data.recentGoals && data.recentGoals.length > 0 ? (
            <div className="divide-y divide-border/60">
              {data.recentGoals.map((goal) => (
                <div key={goal.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-text truncate">{goal.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border
                      ${goal.status === 'COMPLETED' ? 'bg-success-50 text-success border-success/20' : 'bg-surface-elevated text-text-secondary border-border/80'}`}>
                      {goal.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-1.5">
                    <p className="text-xs text-text-muted">Deadline: {goal.deadline}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-border/50 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${goal.progressPercentage}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-text-secondary">{goal.progressPercentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted py-4 text-center">No recent goals found</p>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="border border-border bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-text mb-4 flex items-center gap-2">
            <CheckSquare size={16} className="text-primary" />
            Upcoming Tasks
          </h2>
          {data.upcomingTasks && data.upcomingTasks.length > 0 ? (
            <div className="divide-y divide-border/60">
              {data.upcomingTasks.map((task) => (
                <div key={task.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-text truncate">{task.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border
                      ${task.status === 'COMPLETED'
                        ? 'bg-success-50 text-success border-success/20'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-info-50 text-info border-info/20'
                        : 'bg-surface-elevated text-text-secondary border-border/80'}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 mt-1.5">
                    <p className="text-xs text-text-muted">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted py-4 text-center">No upcoming tasks found</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
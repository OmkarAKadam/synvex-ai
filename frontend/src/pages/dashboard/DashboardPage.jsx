import { useEffect, useState } from 'react'
import { getDashboard } from '../../services/dashboardService'
import DashboardLayout from '../../components/layout/DashboardLayout'
import useAuth from '../../hooks/useAuth'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Alert from '../../components/ui/Alert'
import Spinner from '../../components/ui/Spinner'
import { Calendar, Target, CheckSquare, BarChart2 } from 'lucide-react'

function DashboardPage() {
  const { currentUser } = useAuth()
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const userWorkStyleName = {
    POMODORO: { label: 'Pomodoro', variant: 'info' },
    DEEP_WORK: { label: 'Deep Work', variant: 'success' },
    SPRINT: { label: 'Sprint', variant: 'warning' },
    FLEXIBLE: { label: 'Flexible', variant: 'neutral' },
  }

  const getWorkStyle = (score) => {
    if (score >= 80) return { label: 'High Performer', variant: 'success' }
    if (score >= 60) return { label: 'Focused', variant: 'info' }
    if (score >= 40) return { label: 'Steady', variant: 'warning' }
    return { label: 'Building Momentum', variant: 'neutral' }
  }

  const badgeVariant = (status) => {
    if (status === 'COMPLETED') return 'success'
    if (status === 'IN_PROGRESS') return 'info'
    return 'neutral'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center gap-2">
        <Spinner size="md" />
        <span className="text-text-secondary font-medium">Loading dashboard…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <Alert variant="error" className="max-w-md w-full">
          {error}
        </Alert>
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

  const userStyle = currentUser?.workStyle ? userWorkStyleName[currentUser.workStyle] : null
  const workStyle = userStyle || getWorkStyle(data.productivityScore)
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const completionPct = data.totalGoals > 0 ? Math.round((data.completedGoals / data.totalGoals) * 100) : 0

  const kpiCards = [
    { label: "Today's Tasks", value: data.todayTasks, description: 'Tasks due today', icon: Calendar, iconBg: 'bg-primary/10 text-primary' },
    { label: 'Active Goals', value: data.activeGoals, description: 'In progress goals', icon: Target, iconBg: 'bg-success/10 text-success' },
    { label: 'Completion Rate', value: `${completionPct}%`, description: `${data.completedGoals} of ${data.totalGoals} goals completed`, icon: CheckSquare, iconBg: 'bg-info/10 text-info' },
    { label: 'AI Productivity Score', value: `${data.productivityScore}%`, description: 'Overall completion rate', icon: BarChart2, iconBg: 'bg-accent/10 text-accent' },
  ]

  return (
    <DashboardLayout>
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text">
              {getGreeting()}{currentUser?.name ? `, ${currentUser.name}` : ''}
            </h1>
            <p className="text-text-muted mt-1.5 text-base">
              You have <span className="text-text font-semibold">{data.todayTasks}</span> task{data.todayTasks !== 1 ? 's' : ''} due today and{' '}
              <span className="text-text font-semibold">{data.activeGoals}</span> active goal{data.activeGoals !== 1 ? 's' : ''}.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={workStyle.variant}>{workStyle.label}</Badge>
            <p className="text-xs text-text-muted">{todayDate}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">{metric.label}</p>
                  <p className="text-3xl font-bold mt-1.5 tracking-tight text-text">{metric.value}</p>
                  <p className="text-xs text-text-muted mt-1.5">{metric.description}</p>
                </div>
                <div className={`p-2 rounded-lg border border-border/40 ${metric.iconBg}`}>
                  <Icon size={18} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Two Column Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Goals */}
        <Card>
          <Card.Header>
            <h2 className="text-base font-semibold text-text flex items-center gap-2">
              <Target size={16} className="text-primary" />
              Recent Goals
            </h2>
          </Card.Header>
          {data.recentGoals && data.recentGoals.length > 0 ? (
            <div className="divide-y divide-border/60">
              {data.recentGoals.map((goal) => (
                <div key={goal.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-text truncate">{goal.title}</p>
                    <Badge variant={badgeVariant(goal.status)}>{goal.status}</Badge>
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
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <Card.Header>
            <h2 className="text-base font-semibold text-text flex items-center gap-2">
              <CheckSquare size={16} className="text-primary" />
              Upcoming Tasks
            </h2>
          </Card.Header>
          {data.upcomingTasks && data.upcomingTasks.length > 0 ? (
            <div className="divide-y divide-border/60">
              {data.upcomingTasks.map((task) => (
                <div key={task.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-text truncate">{task.title}</p>
                    <Badge variant={badgeVariant(task.status)}>{task.status}</Badge>
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
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
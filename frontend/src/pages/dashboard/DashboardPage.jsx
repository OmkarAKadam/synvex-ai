import { useEffect, useState } from 'react'
import { getDashboard } from '../../services/dashboardService'

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
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!data) {
    return <div>No data</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>Summary</h2>
        <ul>
          <li>Total Goals: {data.totalGoals}</li>
          <li>Completed Goals: {data.completedGoals}</li>
          <li>Active Goals: {data.activeGoals}</li>
          <li>Total Tasks: {data.totalTasks}</li>
          <li>Completed Tasks: {data.completedTasks}</li>
          <li>Pending Tasks: {data.pendingTasks}</li>
          <li>Today Tasks: {data.todayTasks}</li>
          <li>Productivity Score: {data.productivityScore}</li>
        </ul>
      </section>
      <section>
        <h2>Recent Goals</h2>
        {data.recentGoals && data.recentGoals.length > 0 ? (
          <ul>
            {data.recentGoals.map((goal) => (
              <li key={goal.id}>
                {goal.title} - Deadline: {goal.deadline} - Progress: {goal.progressPercentage}% - Status: {goal.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent goals</p>
        )}
      </section>
      <section>
        <h2>Upcoming Tasks</h2>
        {data.upcomingTasks && data.upcomingTasks.length > 0 ? (
          <ul>
            {data.upcomingTasks.map((task) => (
              <li key={task.id}>
                {task.title} - Due: {task.dueDate} - Status: {task.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming tasks</p>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
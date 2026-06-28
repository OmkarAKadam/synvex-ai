import { useState } from 'react'
import {
  breakdownGoal,
  generateDailyPlan,
  analyzeRisk,
  generateReplanning,
  analyzeAnalytics,
} from '../../services/aiService'
import GoalBreakdownForm from '../../components/ai/GoalBreakdownForm'
import DailyPlanForm from '../../components/ai/DailyPlanForm'
import RiskAnalysisForm from '../../components/ai/RiskAnalysisForm'
import ReplanningForm from '../../components/ai/ReplanningForm'
import AnalyticsForm from '../../components/ai/AnalyticsForm'
import AiResult from '../../components/ai/AiResult'

export default function AiPage() {
  const [activeTool, setActiveTool] = useState('goal-breakdown')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const tools = [
    { id: 'goal-breakdown', label: 'Goal Breakdown', Form: GoalBreakdownForm, submit: breakdownGoal, resultTitle: 'Plan' },
    { id: 'daily-plan', label: 'Daily Planner', Form: DailyPlanForm, submit: generateDailyPlan, resultTitle: 'Plan' },
    { id: 'risk-analysis', label: 'Risk Analysis', Form: RiskAnalysisForm, submit: analyzeRisk, resultTitle: 'Analysis' },
    { id: 'replanning', label: 'Replanning', Form: ReplanningForm, submit: generateReplanning, resultTitle: 'Updated Plan' },
    { id: 'analytics', label: 'Analytics', Form: AnalyticsForm, submit: analyzeAnalytics, resultTitle: 'Insights' },
  ]

  const currentTool = tools.find(t => t.id === activeTool)

  const ActiveForm = currentTool.Form

  async function handleSubmit(values) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await currentTool.submit(values)
      // response contains a single field: plan, analysis, updatedPlan, or insights
      const text = response.plan || response.analysis || response.updatedPlan || response.insights
      setResult(text)
    } catch (err) {
      setError(err.friendlyMessage || err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    setResult(null)
    setError(null)
  }

  return (
    <div>
      <h1>AI Tools</h1>

      <nav style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveTool(t.id); setResult(null); setError(null); }}
            style={{
              padding: '0.5rem 1rem',
              background: activeTool === t.id ? '#0066cc' : '#eee',
              color: activeTool === t.id ? '#fff' : '#000',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}

      <ActiveForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={loading}
      />

      {result && <AiResult title={currentTool.resultTitle} content={result} />}
    </div>
  )
}
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
import DashboardLayout from '../../components/layout/DashboardLayout'

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
    <DashboardLayout title="AI Tools">
      {/* Sub navigation tabs */}
      <div className="border-b border-border flex items-center gap-6 overflow-x-auto scrollbar-none mb-6">
        {tools.map(t => {
          const isActive = activeTool === t.id
          return (
            <button
              key={t.id}
              onClick={() => { setActiveTool(t.id); setResult(null); setError(null); }}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap cursor-pointer
                ${isActive
                  ? 'border-primary text-text'
                  : 'border-transparent text-text-muted hover:text-text'
                }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-medium max-w-xl">
          Error: {error}
        </div>
      )}

      {/* Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="border border-border bg-surface rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider text-text-secondary">
            Configure {currentTool.label}
          </h2>
          <ActiveForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={loading}
          />
        </div>

        {/* AI Result Card */}
        {result ? (
          <AiResult title={currentTool.resultTitle} content={result} />
        ) : (
          <div className="border border-border border-dashed bg-surface/30 rounded-xl p-8 text-center text-text-muted text-sm py-16">
            Configure the parameters and generate to view AI insights.
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
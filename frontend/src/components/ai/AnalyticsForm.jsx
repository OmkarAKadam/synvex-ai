import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  goal: z.string().min(1, 'Goal is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  progressPercentage: z.coerce.number().int().min(0, 'Progress must be at least 0').max(100, 'Progress cannot exceed 100'),
  completedTasks: z.coerce.number().int().min(0, 'Completed tasks cannot be negative'),
  pendingTasks: z.coerce.number().int().min(0, 'Pending tasks cannot be negative'),
  availableHours: z.coerce.number().int().positive('Available hours must be positive'),
})

export default function AnalyticsForm({ onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { goal: '', deadline: '', progressPercentage: '', completedTasks: '', pendingTasks: '', availableHours: '' },
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '480px' }}>
      <div>
        <label htmlFor="goal" style={{ display: 'block', marginBottom: '0.2rem' }}>Goal *</label>
        <textarea id="goal" rows={3} {...register('goal')} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.goal && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.goal.message}</span>}
      </div>

      <div>
        <label htmlFor="deadline" style={{ display: 'block', marginBottom: '0.2rem' }}>Deadline *</label>
        <input id="deadline" type="date" {...register('deadline')} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.deadline && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.deadline.message}</span>}
      </div>

      <div>
        <label htmlFor="progressPercentage" style={{ display: 'block', marginBottom: '0.2rem' }}>Progress Percentage *</label>
        <input id="progressPercentage" type="number" min={0} max={100} step={1} {...register('progressPercentage', { valueAsNumber: true })} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.progressPercentage && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.progressPercentage.message}</span>}
      </div>

      <div>
        <label htmlFor="completedTasks" style={{ display: 'block', marginBottom: '0.2rem' }}>Completed Tasks *</label>
        <input id="completedTasks" type="number" min={0} step={1} {...register('completedTasks', { valueAsNumber: true })} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.completedTasks && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.completedTasks.message}</span>}
      </div>

      <div>
        <label htmlFor="pendingTasks" style={{ display: 'block', marginBottom: '0.2rem' }}>Pending Tasks *</label>
        <input id="pendingTasks" type="number" min={0} step={1} {...register('pendingTasks', { valueAsNumber: true })} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.pendingTasks && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.pendingTasks.message}</span>}
      </div>

      <div>
        <label htmlFor="availableHours" style={{ display: 'block', marginBottom: '0.2rem' }}>Available Hours Per Day *</label>
        <input id="availableHours" type="number" min={1} step={1} {...register('availableHours', { valueAsNumber: true })} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.availableHours && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.availableHours.message}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem' }}>
          {submitting ? 'Analyzing…' : 'Analyze Productivity'}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem' }}>Cancel</button>
      </div>
    </form>
  )
}
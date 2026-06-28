import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const workStyleValues = ['FLEXIBLE', 'STRUCTURED', 'REMOTE']

const schema = z.object({
  goal: z.string().min(1, 'Goal is required'),
  date: z.string().min(1, 'Date is required'),
  availableHours: z.coerce.number().int().positive('Available hours must be positive'),
  workStyle: z.enum(workStyleValues, { required_error: 'Work style is required' }),
})

export default function DailyPlanForm({ onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { goal: '', date: '', availableHours: '', workStyle: '' },
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
        <label htmlFor="date" style={{ display: 'block', marginBottom: '0.2rem' }}>Date *</label>
        <input id="date" type="date" {...register('date')} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.date && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.date.message}</span>}
      </div>

      <div>
        <label htmlFor="availableHours" style={{ display: 'block', marginBottom: '0.2rem' }}>Available Hours *</label>
        <input id="availableHours" type="number" min={1} step={1} {...register('availableHours', { valueAsNumber: true })} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.availableHours && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.availableHours.message}</span>}
      </div>

      <div>
        <label htmlFor="workStyle" style={{ display: 'block', marginBottom: '0.2rem' }}>Work Style *</label>
        <select id="workStyle" {...register('workStyle')} style={{ width: '100%', padding: '0.4rem' }}>
          <option value="">— select —</option>
          {workStyleValues.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        {errors.workStyle && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.workStyle.message}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem' }}>
          {submitting ? 'Generating…' : 'Generate Plan'}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem' }}>Cancel</button>
      </div>
    </form>
  )
}
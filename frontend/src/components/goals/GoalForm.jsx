import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const priorityValues = ['LOW', 'MEDIUM', 'HIGH']

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title ≤ 200 chars'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description ≤ 2000 chars'),
  deadline: z.string().min(1, 'Deadline is required'),
  priority: z.enum(priorityValues, { required_error: 'Priority is required' }),
})

export default function GoalForm({ defaultValues, onSubmit, onCancel, submitting }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '480px' }}>
      <div>
        <label htmlFor="title">Title *</label>
        <input id="title" {...register('title')} />
        {errors.title && <span style={{color:'red'}}>{errors.title.message}</span>}
      </div>

      <div>
        <label htmlFor="description">Description *</label>
        <textarea id="description" rows={3} {...register('description')} />
        {errors.description && <span style={{color:'red'}}>{errors.description.message}</span>}
      </div>

      <div>
        <label htmlFor="deadline">Deadline *</label>
        <input id="deadline" type="date" {...register('deadline')} />
        {errors.deadline && <span style={{color:'red'}}>{errors.deadline.message}</span>}
      </div>

      <div>
        <label htmlFor="priority">Priority *</label>
        <select id="priority" {...register('priority')}>
          <option value="">— select —</option>
          {priorityValues.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.priority && <span style={{color:'red'}}>{errors.priority.message}</span>}
      </div>

      <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem'}}>
        <button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
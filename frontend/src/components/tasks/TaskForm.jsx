import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ---------- Zod schema – mirrors TaskDTO ----------
const priorityValues = ['LOW', 'MEDIUM', 'HIGH']

const taskSchema = z.object({
  // goalId is only required on CREATE; on EDIT the backend ignores it.
  // We coerce the incoming string from <select> to a number.
  goalId: z.coerce.number({ required_error: 'Goal is required' }).min(1, 'Goal is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be ≤ 200 characters'),
  description: z.string().max(1000, 'Description must be ≤ 1000 characters').optional().or(z.literal('')),
  estimatedHours: z.coerce.number().int().min(1, 'Estimated hours must be at least 1').optional().nullable(),
  priority: z.enum(priorityValues, { required_error: 'Priority is required' }),
  dueDate: z.string().min(1, 'Due date is required'),          // ISO string from <input type="date">
})

export default function TaskForm({
  defaultValues = {},
  onSubmit,
  onCancel,
  submitting,
  goals = [],               // supplied by TasksPage – no internal fetch
  isEditing = false,        // when true we hide/disable the goal selector
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
    mode: 'onChange',
  })

  // When editing we don't want the backend‑wise don't need goalId – keep the field out of the payload.
  // The easiest way is to omit it from the submitted values.
  const onValidSubmit = (data) => {
    const payload = isEditing ? { ...data } : { ...data }
    if (isEditing) delete payload.goalId          // backend updateTask does not use goalId
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '480px' }}>
      {/* Goal selector – only for CREATE */}
      {!isEditing && (
        <div>
          <label htmlFor="goalId" style={{ display: 'block', marginBottom: '0.2rem' }}>
            Goal *
          </label>
          <select id="goalId" {...register('goalId')} style={{ width: '100%', padding: '0.4rem' }}>
            <option value="">— select goal —</option>
            {goals.map(g => (
              <option key={g.id} value={g.id}>{g.title}</option>
            ))}
          </select>
          {errors.goalId && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.goalId.message}</span>}
        </div>
      )}

      <div>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Title *
        </label>
        <input id="title" {...register('title')} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.title && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.title.message}</span>}
      </div>

      <div>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          style={{ width: '100%', padding: '0.4rem' }}
        />
        {errors.description && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.description.message}</span>}
      </div>

      <div>
        <label htmlFor="estimatedHours" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Estimated Hours
        </label>
        <input
          id="estimatedHours"
          type="number"
          min={1}
          step={1}
          {...register('estimatedHours', { valueAsNumber: true })}
          style={{ width: '100%', padding: '0.4rem' }}
        />
        {errors.estimatedHours && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.estimatedHours.message}</span>}
      </div>

      <div>
        <label htmlFor="priority" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Priority *
        </label>
        <select id="priority" {...register('priority')} style={{ width: '100%', padding: '0.4rem' }}>
          <option value="">— select —</option>
          {priorityValues.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.priority && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.priority.message}</span>}
      </div>

      <div>
        <label htmlFor="dueDate" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Due Date *
        </label>
        <input id="dueDate" type="date" {...register('dueDate')} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.dueDate && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.dueDate.message}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem' }}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} style={{ padding: '0.5rem 1rem' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}
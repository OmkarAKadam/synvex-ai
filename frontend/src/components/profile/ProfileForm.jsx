import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const workStyleValues = ['FLEXIBLE', 'STRUCTURED', 'REMOTE']

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be ≤ 100 characters'),
  email: z.string().email('Email must be a valid email address'),
  occupation: z.string().max(200, 'Occupation must be ≤ 200 characters').optional().or(z.literal('')),
  availableHours: z.coerce.number().int().min(1, 'Available hours must be at least 1').max(24, 'Available hours cannot exceed 24').optional().nullable(),
  workStyle: z.enum(workStyleValues).optional(),
})

export default function ProfileForm({ defaultValues = {}, onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '480px' }}>
      <div>
        <label htmlFor="name" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Name *
        </label>
        <input id="name" {...register('name')} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.name && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Email *
        </label>
        <input id="email" type="email" {...register('email')} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.email && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="occupation" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Occupation
        </label>
        <input id="occupation" {...register('occupation')} style={{ width: '100%', padding: '0.4rem' }} />
        {errors.occupation && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.occupation.message}</span>}
      </div>

      <div>
        <label htmlFor="availableHours" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Available Hours (per week)
        </label>
        <input
          id="availableHours"
          type="number"
          min={1}
          max={24}
          step={1}
          {...register('availableHours', { valueAsNumber: true })}
          style={{ width: '100%', padding: '0.4rem' }}
        />
        {errors.availableHours && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.availableHours.message}</span>}
      </div>

      <div>
        <label htmlFor="workStyle" style={{ display: 'block', marginBottom: '0.2rem' }}>
          Work Style
        </label>
        <select id="workStyle" {...register('workStyle')} style={{ width: '100%', padding: '0.4rem' }}>
          <option value="">— select —</option>
          {workStyleValues.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        {errors.workStyle && <span style={{ color: 'red', fontSize: '0.85rem' }}>{errors.workStyle.message}</span>}
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
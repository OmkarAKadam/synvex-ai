import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'

const priorityValues = ['LOW', 'MEDIUM', 'HIGH']

const taskSchema = z.object({
  goalId: z.coerce.number({ required_error: 'Goal is required' }).min(1, 'Goal is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be ≤ 200 characters'),
  description: z.string().max(1000, 'Description must be ≤ 1000 characters').optional().or(z.literal('')),
  estimatedHours: z.coerce.number().int().min(1, 'Estimated hours must be at least 1').optional().nullable(),
  priority: z.enum(priorityValues, { required_error: 'Priority is required' }),
  dueDate: z.string().min(1, 'Due date is required'),
})

export default function TaskForm({
  defaultValues = {},
  onSubmit,
  onCancel,
  submitting,
  goals = [],
  isEditing = false,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
    mode: 'onChange',
  })

  const titleValue = watch('title') || ''
  const descriptionValue = watch('description') || ''

  const onValidSubmit = (data) => {
    const payload = { ...data }
    if (isEditing) delete payload.goalId
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-4">
      {!isEditing && (
        <div>
          <label htmlFor="goalId" className="block text-sm font-medium text-text-secondary mb-1.5">
            Goal *
          </label>
          <select
            id="goalId"
            disabled={submitting}
            {...register('goalId')}
            className={`w-full px-3.5 py-2 rounded-input bg-bg border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${errors.goalId ? 'border-error focus:ring-error focus:border-error' : 'border-border'}`}
            aria-invalid={errors.goalId ? 'true' : undefined}
          >
            <option value="">— select goal —</option>
            {goals.map(g => (
              <option key={g.id} value={g.id}>{g.title}</option>
            ))}
          </select>
          {errors.goalId && (
            <p className="text-xs text-error font-medium mt-1.5" role="alert">{errors.goalId.message}</p>
          )}
        </div>
      )}

      <Input
        label="Title"
        required
        placeholder="Enter task title"
        error={errors.title?.message}
        disabled={submitting}
        helperText={`${titleValue.length}/200`}
        {...register('title')}
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Enter task description"
          disabled={submitting}
          {...register('description')}
          className={`w-full px-3.5 py-2 rounded-input bg-bg border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 resize-vertical ${errors.description ? 'border-error focus:ring-error focus:border-error' : 'border-border'}`}
          aria-invalid={errors.description ? 'true' : undefined}
        />
        <div className="flex items-center justify-between mt-1.5">
          {errors.description ? (
            <p className="text-xs text-error font-medium" role="alert">{errors.description.message}</p>
          ) : (
            <span />
          )}
          <p className={`text-xs ${errors.description ? 'text-error' : 'text-text-muted'}`}>
            {descriptionValue.length}/1000
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-text-secondary mb-1.5">
            Due Date *
          </label>
          <input
            id="dueDate"
            type="date"
            disabled={submitting}
            {...register('dueDate')}
            className={`w-full px-3.5 py-2 rounded-input bg-bg border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${errors.dueDate ? 'border-error focus:ring-error focus:border-error' : 'border-border'}`}
            aria-invalid={errors.dueDate ? 'true' : undefined}
          />
          {errors.dueDate && (
            <p className="text-xs text-error font-medium mt-1.5" role="alert">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-text-secondary mb-1.5">
            Priority *
          </label>
          <select
            id="priority"
            disabled={submitting}
            {...register('priority')}
            className={`w-full px-3.5 py-2 rounded-input bg-bg border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${errors.priority ? 'border-error focus:ring-error focus:border-error' : 'border-border'}`}
            aria-invalid={errors.priority ? 'true' : undefined}
          >
            <option value="">— select —</option>
            {priorityValues.map(p => (
              <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
            ))}
          </select>
          {errors.priority && (
            <p className="text-xs text-error font-medium mt-1.5" role="alert">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <Input
        label="Estimated Hours"
        type="number"
        min={1}
        step={1}
        placeholder="Enter estimated hours"
        error={errors.estimatedHours?.message}
        disabled={submitting}
        {...register('estimatedHours', { valueAsNumber: true })}
      />

      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Save
        </Button>
      </div>
    </form>
  )
}

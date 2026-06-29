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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1.5">
          Title *
        </label>
        <input
          id="title"
          placeholder="Enter goal title"
          {...register('title')}
          className="w-full px-3.5 py-2 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        />
        {errors.title && <p className="text-xs text-error font-medium mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">
          Description *
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Enter goal description"
          {...register('description')}
          className="w-full px-3.5 py-2 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        />
        {errors.description && <p className="text-xs text-error font-medium mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary mb-1.5">
          Deadline *
        </label>
        <input
          id="deadline"
          type="date"
          {...register('deadline')}
          className="w-full px-3.5 py-2 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        />
        {errors.deadline && <p className="text-xs text-error font-medium mt-1">{errors.deadline.message}</p>}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-text-secondary mb-1.5">
          Priority *
        </label>
        <select
          id="priority"
          {...register('priority')}
          className="w-full px-3.5 py-2 rounded-lg bg-bg border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <option value="">— select —</option>
          {priorityValues.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.priority && <p className="text-xs text-error font-medium mt-1">{errors.priority.message}</p>}
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-text font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
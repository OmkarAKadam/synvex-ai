import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { goalSchema } from '../../utils/validators'

import Input from '../ui/Input'
import Button from '../ui/Button'

const priorityValues = ['LOW', 'MEDIUM', 'HIGH']

export default function GoalForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitting,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues,
    mode: 'onChange',
  })

  const titleValue = watch('title') || ''
  const descriptionValue = watch('description') || ''

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        required
        placeholder="Enter goal title"
        error={errors.title?.message}
        helperText={`${titleValue.length}/200`}
        disabled={submitting}
        {...register('title')}
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-text-secondary mb-1.5"
        >
          Description *
        </label>

        <textarea
          id="description"
          rows={3}
          placeholder="Enter goal description"
          disabled={submitting}
          {...register('description')}
          aria-invalid={errors.description ? 'true' : undefined}
          className={`w-full px-3.5 py-2 rounded-input bg-bg border text-text placeholder:text-text-muted resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
            errors.description
              ? 'border-error focus:ring-error focus:border-error'
              : 'border-border'
          }`}
        />

        <div className="flex items-center justify-between mt-1.5">
          {errors.description ? (
            <p className="text-xs font-medium text-error" role="alert">
              {errors.description.message}
            </p>
          ) : (
            <span />
          )}

          <p
            className={`text-xs ${
              errors.description ? 'text-error' : 'text-text-muted'
            }`}
          >
            {descriptionValue.length}/2000
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            Deadline *
          </label>

          <input
            id="deadline"
            type="date"
            disabled={submitting}
            {...register('deadline')}
            aria-invalid={errors.deadline ? 'true' : undefined}
            className={`w-full px-3.5 py-2 rounded-input bg-bg border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
              errors.deadline
                ? 'border-error focus:ring-error focus:border-error'
                : 'border-border'
            }`}
          />

          {errors.deadline && (
            <p className="mt-1.5 text-xs font-medium text-error" role="alert">
              {errors.deadline.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            Priority *
          </label>

          <select
            id="priority"
            disabled={submitting}
            {...register('priority')}
            aria-invalid={errors.priority ? 'true' : undefined}
            className={`w-full px-3.5 py-2 rounded-input bg-bg border text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${
              errors.priority
                ? 'border-error focus:ring-error focus:border-error'
                : 'border-border'
            }`}
          >
            <option value="">Select priority</option>
            {priorityValues.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          {errors.priority && (
            <p className="mt-1.5 text-xs font-medium text-error" role="alert">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-4 mt-6 border-t border-border/60">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button type="submit" loading={submitting}>
          Save
        </Button>
      </div>
    </form>
  )
}
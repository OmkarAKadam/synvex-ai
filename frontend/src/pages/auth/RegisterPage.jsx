import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../utils/validators'
import { register } from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function RegisterPage() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState('')

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    setAuthError('')
    try {
      await register(data)
      navigate('/login')
    } catch (err) {
      const message = err?.response?.data?.message || err?.friendlyMessage || 'Registration failed'
      setAuthError(message)
    }
  }

  const isLoading = isSubmitting

  return (
    <div>
      <h1>Register</h1>
      {authError && <div role="alert" style={{ color: 'red' }}>{authError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            {...registerField('name')}
            type="text"
            autoComplete="name"
            disabled={isLoading}
          />
          {errors.name && <span role="alert" style={{ color: 'red' }}>{errors.name.message}</span>}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            {...registerField('email')}
            type="email"
            autoComplete="email"
            disabled={isLoading}
          />
          {errors.email && <span role="alert" style={{ color: 'red' }}>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            {...registerField('password')}
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          {errors.password && <span role="alert" style={{ color: 'red' }}>{errors.password.message}</span>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            {...registerField('confirmPassword')}
            type="password"
            autoComplete="new-password"
            disabled={isLoading}
          />
          {errors.confirmPassword && <span role="alert" style={{ color: 'red' }}>{errors.confirmPassword.message}</span>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
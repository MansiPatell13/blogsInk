import React, { useState } from 'react'
import { useAuth } from '../../utils/useAuth.jsx'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import FormInput from '../ui/FormInput'
import LoadingButton from '../ui/LoadingButton'
import { validateEmail } from '../../utils/formValidation'
import useForm from '../../utils/useForm'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()

  const validators = {
    email: validateEmail,
    password: (value) => !value ? 'Password is required' : '',
  }

  const handleLoginSubmit = async (values) => {
    try {
      const result = await login(values.email, values.password)
      
      if (result.success) {
        toast.success('Welcome back!')
        // Redirect to home page after successful login
        window.location.href = '/'
      } else {
        toast.error(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An unexpected error occurred. Please try again later.')
    }
  }

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
  } = useForm(
    { email: '', password: '' },
    validators,
    handleLoginSubmit
  )

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="your@email.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          validate={validateEmail}
          required
          icon={Mail}
          autoComplete="email"
        />

        <div className="relative">
          <FormInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="••••••••"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            validate={validators.password}
            required
            icon={Lock}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <LoadingButton
        type="submit"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        variant="primary"
        size="lg"
        className="w-full"
        loadingText="Signing in..."
        showLoadingText={true}
      >
        Sign in
        <ArrowRight className="ml-2 h-4 w-4" />
      </LoadingButton>
    </form>
  )
}

export default LoginForm

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, signup, loading, error, clearError } = useAuthStore()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const ok = mode === 'login' ? await login(email, password) : await signup(email, password, name)
    if (ok) navigate('/profile')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-1 text-2xl font-extrabold text-gray-800 dark:text-gray-100">
        {mode === 'login' ? 'С возвращением!' : 'Создать аккаунт'}
      </h1>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        Прогресс будет сохранён в облаке и доступен с любого устройства.
      </p>

      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === 'signup' && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Имя"
            required
            className="rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-duo-blue dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
          className="rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-duo-blue dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Пароль"
          required
          minLength={8}
          className="rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-duo-blue dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />

        {error && <p className="text-sm font-bold text-duo-red-dark">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-3d mt-2 rounded-2xl bg-duo-green py-3.5 font-extrabold text-white disabled:opacity-60"
          style={{ ['--btn-shadow' as any]: '#58a700' }}
        >
          {loading ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      <button
        onClick={() => {
          clearError()
          setMode(mode === 'login' ? 'signup' : 'login')
        }}
        className="mt-4 text-sm font-bold text-duo-blue"
      >
        {mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
      </button>

      <button onClick={() => navigate('/')} className="mt-6 text-sm font-bold text-gray-400">
        Продолжить без аккаунта
      </button>
    </div>
  )
}

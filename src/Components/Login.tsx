import { useSubStore } from '../Stores/SubStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import ErrorDisplay from './ErrorDisplay'

const schema = z.object({
  rememberMe: z.boolean(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(6, 'Username must not be longer than 6 characters')
    .refine(x => !(/dog/i).test(x), 'No dogs allowed')
})
type Schema = z.infer<typeof schema>

function Login() {
  const subStore = useSubStore()
  const loggedIn = Boolean(subStore.subId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: validationErrors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  function logout() {
    subStore.logout()
    subStore.openDialog(false)
  }

  function login(data: Schema) {
    subStore.login(data.username, data.rememberMe)
    close()
  }

  function close() {
    reset()
    subStore.openDialog(false)
  }

  return (
    <dialog open={subStore.dialogIsOpen}>
      {loggedIn && <article className="max-w-md">
        <h2>Login</h2>
        <p>You are currently logged in as <strong>{subStore.subId}</strong>.</p>
        <footer className="grid">
          <button onClick={logout}>Logout</button>
          <button type="button" className="secondary m-0" onClick={close}>Cancel</button>
        </footer>
      </article>}

      {!loggedIn && <form onSubmit={handleSubmit(login)}>
        <article className="max-w-md">
          <h2>Login</h2>
        
          <label>
            Username
            <input
              {...register('username')}
              type="text"
              aria-invalid={validationErrors.username ? true : undefined}
              aria-describedby={validationErrors.username ? 'validation-username' : undefined}
              className="m-0"
            />
          </label>
          <ErrorDisplay className="m-0" id="validation-username" error={validationErrors?.username?.message} />
          <label>
            <input
              {...register('rememberMe')}
              type="checkbox"
            />
            remember me
          </label>
          <p><small>If you check "remember me" we will store your username in your browser's storage. For more information, view our <a href="/privacy-policy.html" target="_blank">privacy policy</a>.</small></p>
        
          <footer className="grid">
            <button type="submit" className="m-0">Login</button>
            <button type="button" className="secondary m-0" onClick={close}>Cancel</button>
          </footer>
        </article>
      </form>
      }
    </dialog>
  )
}

export default Login

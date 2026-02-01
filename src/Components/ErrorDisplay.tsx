import { ApiRequestError, ApiResponseError } from '@thatapicompany/thecatapi'

interface ErrorDisplayProps {
  id?: string
  error?: unknown
  backup?: string
  className?: string
}

function ErrorDisplay({ error, backup, id, className }: ErrorDisplayProps) {
  function getErrorText() {
    if (!error) return undefined
    if (typeof error === 'string') return error
    if (error instanceof ApiResponseError)
      return error.data || error.message || error.name
    if (error instanceof ApiRequestError) return error.message || error.name

    return backup || error.toString()
  }

  return (
    <>
      {getErrorText() && (
        <p className={'text-error ' + (className ?? '')} id={id}>
          <span className="icon-attention-circled"></span>
          <> {getErrorText()}</>
        </p>
      )}
    </>
  )
}

export default ErrorDisplay

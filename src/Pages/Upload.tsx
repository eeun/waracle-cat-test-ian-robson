import { useState } from 'react'
import { theCatAPI } from '../lib/api'
import { useNavigate } from 'react-router'
import { ROUTES } from '../routes'
import { CAT_STORE_KEY } from '../Stores/CatStore'
import { useQueryClient } from '@tanstack/react-query'
import { useSubStore } from '../Stores/SubStore'
import ErrorDisplay from '../Components/ErrorDisplay'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

export const MAX_IMAGE_MB = 2
const MAX_IMAGE_SIZE = MAX_IMAGE_MB * 1024 * 1024
const VALID_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
] as ReadonlyArray<string>
const VALID_TYPES_STRING = VALID_TYPES
  .map((x) => x.replace('image/', ''))
  .join(', ')

const schema = z.object({
  file: z
    .custom<File[]>()
    .refine((files) => files?.length === 1, 'File not selected')
    .refine(
      (files) => files[0].size <= MAX_IMAGE_SIZE,
      `File must be less than ${MAX_IMAGE_MB} MB`
    )
    .refine(
      (files) => VALID_TYPES.includes(files[0].type),
      `Invalid file type. Please upload ${VALID_TYPES_STRING}`
    ),
})

type Schema = z.infer<typeof schema>

function Upload() {
  const {
    register,
    handleSubmit,
    resetField,
    clearErrors,
    formState: { errors: validationErrors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const subStore = useSubStore()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearErrors('file')
    setError(null)
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Create preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const doSubmit = async (data: Schema) => {
    if (subStore.subId === null) return subStore.openDialog()
    setLoading(true)
    setError(null)

    try {
      await theCatAPI.images.uploadImage(data.file[0], subStore.subId)
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey.includes(CAT_STORE_KEY),
      })
      navigate(ROUTES.Home)
    } catch (e) {
      setError(e)
    }

    setLoading(false)
  }

  const handleReset = () => {
    setPreview(null)
    setError(null)
    resetField('file')
  }

  return (
    <div>
      <h2>Upload Cat Image</h2>
      <div className="upload-split">
        <form onSubmit={handleSubmit(doSubmit)}>
          <label>
            Select Image
            <input
              {...register('file')}
              type="file"
              accept={VALID_TYPES.join(',')}
              className="m-0"
              onChange={handleFileChange}
              disabled={loading}
              aria-invalid={validationErrors.file ? true : undefined}
              aria-describedby={validationErrors.file ? 'validation-file' : undefined}
            />
          </label>
          <ErrorDisplay id="validation-file" error={validationErrors?.file?.message} />
          <p>
            <small>
              Supported formats:
              <> {VALID_TYPES_STRING} </>
              (max {MAX_IMAGE_MB}MB)
            </small>
          </p>

          <ErrorDisplay
            error={error}
            backup="Upload Failed"
          />

          <div className="grid">
            <button type="submit" disabled={loading}>
              {loading && <span className="icon-spin1 animate-spin"></span>}
              {!loading && <span className="icon-upload-cloud"></span>}
              <> Upload Image</>
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="secondary"
              type="button"
            >
              Clear
            </button>
          </div>
        </form>
        {preview && (
          <article>
            <figure>
              <img src={preview} alt="Preview" />
              <figcaption className="text-center">your image</figcaption>
            </figure>
          </article>
        )}
      </div>
    </div>
  )
}

export default Upload

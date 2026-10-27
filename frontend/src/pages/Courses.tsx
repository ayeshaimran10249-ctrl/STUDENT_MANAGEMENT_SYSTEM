
import { useEffect, useState } from 'react'
import {
  BookOpen,
  Code2,
  Palette,
  PenTool,
  Plus,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'
import { apiRequest } from '../services/api'

type Course = {
  id: string
  name: string
  description: string
  duration?: string
  status?: 'Active' | 'Inactive'
}

const courseStyle = [
  { icon: Code2, color: 'bg-purple-100 text-purple-700', category: 'Development' },
  { icon: Palette, color: 'bg-amber-100 text-amber-700', category: 'Design' },
  { icon: PenTool, color: 'bg-pink-100 text-pink-700', category: 'Design' },
  { icon: BookOpen, color: 'bg-emerald-100 text-emerald-700', category: 'Programming' },
]

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [saving, setSaving] = useState(false)

  async function loadCourses() {
    try {
      setError('')
      const data = await apiRequest<Course[]>('/courses')
      setCourses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCourses()
  }, [])

  function openAddForm() {
    setEditingId(null)
    setName('')
    setDescription('')
    setDuration('')
    setError('')
    setMessage('')
    setShowForm(true)
  }

  function openEditForm(course: Course) {
    setEditingId(course.id)
    setName(course.name)
    setDescription(course.description || '')
    setDuration(course.duration || '')
    setError('')
    setMessage('')
    setShowForm(true)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const payload = { name: name.trim(), description: description.trim(), duration }

      if (editingId) {
        await apiRequest(`/courses/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setMessage('Course updated successfully.')
      } else {
        await apiRequest('/courses', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage('Course added successfully.')
      }

      setShowForm(false)
      await loadCourses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save course.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(course: Course) {
    if (!window.confirm(`Are you sure you want to delete "${course.name}"?`)) {
      return
    }

    setError('')
    setMessage('')

    try {
      await apiRequest(`/courses/${course.id}`, { method: 'DELETE' })
      setMessage('Course deleted successfully.')
      await loadCourses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete course.')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#8B6A83]">ACADEMIC</p>
          <h1 className="mt-1 text-3xl font-bold text-[#3A0F34]">Courses</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage the courses offered by your institute.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#3A0F34] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={18} /> Add Course
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#3A0F34]">
              {editingId ? 'Edit Course' : 'Add New Course'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
              <X size={20} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-slate-700">
              Course name *
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="e.g. Web Development"
              />
            </label>

            <label className="space-y-1 text-sm font-medium text-slate-700">
              Duration
              <input
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="e.g. 3 months"
              />
            </label>
          </div>

          <label className="block space-y-1 text-sm font-medium text-slate-700">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              rows={3}
              placeholder="Describe the course"
            />
          </label>

          <button
            disabled={saving}
            className="rounded-lg bg-[#3A0F34] px-5 py-2.5 font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : editingId ? 'Update Course' : 'Save Course'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
          No courses found. Add your first course.
        </p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => {
            const style = courseStyle[index % courseStyle.length]
            const Icon = style.icon

            return (
              <article
                key={course.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`rounded-xl p-3 ${style.color}`}>
                    <Icon size={25} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {style.category}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  {course.name}
                </h2>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {course.description || 'No description provided.'}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  Duration: {course.duration || 'Not specified'}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className={`text-sm font-medium ${course.status === 'Inactive' ? 'text-slate-500' : 'text-emerald-700'}`}>
                    {course.status || 'Active'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(course)}
                      className="rounded-lg border border-slate-200 p-2 text-[#3A0F34] hover:bg-slate-50"
                      aria-label={`Edit ${course.name}`}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      onClick={() => void handleDelete(course)}
                      className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      aria-label={`Delete ${course.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}

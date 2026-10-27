
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Plus, Search, X } from 'lucide-react'
import StudentsTable, { type Student } from '../components/StudentsTable'
import { apiRequest } from '../services/api'

const courses = [
  'Web Development',
  'Graphic Design',
  'UI/UX Design',
  'Python Programming',
]

type StudentForm = Omit<Student, 'id'>

const emptyForm: StudentForm = {
  name: '',
  email: '',
  course: courses[0],
  status: 'Active',
}

function normalizeStudents(data: unknown): Student[] {
  const records =
    Array.isArray(data)
      ? data
      : typeof data === 'object' && data !== null &&
          'students' in data && Array.isArray(data.students)
        ? data.students
        : null

  if (!records) {
    throw new Error('Invalid students data received from API.')
  }

  return records.map((item: Record<string, unknown>) => ({
    id: String(item.id ?? item._id ?? ''),
    name: String(item.name ?? ''),
    email: String(item.email ?? ''),
    course: String(item.course ?? ''),
    status: item.status === 'Inactive' ? 'Inactive' : 'Active',
  }))
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<StudentForm>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadStudents = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await apiRequest<unknown>('/students')
      setStudents(normalizeStudents(data))
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to load students.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadStudents()
  }, [loadStudents])

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesName = student.name
        .toLowerCase()
        .includes(search.trim().toLowerCase())

      const matchesCourse =
        courseFilter === '' || student.course === courseFilter

      return matchesName && matchesCourse
    })
  }, [students, search, courseFilter])

  function openAddForm() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  function openEditForm(student: Student) {
    setEditingId(student.id)
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      status: student.status,
    })
    setError('')
    setSuccess('')
    setShowForm(true)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const endpoint = editingId
        ? `/students/${encodeURIComponent(editingId)}`
        : '/students'

      await apiRequest<unknown>(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      })

      await loadStudents()

      setShowForm(false)
      setEditingId(null)
      setForm(emptyForm)
      setSuccess(
        editingId
          ? 'Student updated successfully.'
          : 'Student added successfully.',
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to save student.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(student: Student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`,
    )

    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      await apiRequest<unknown>(
        `/students/${encodeURIComponent(student.id)}`,
        { method: 'DELETE' },
      )

      await loadStudents()
      setSuccess('Student deleted successfully.')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to delete student.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#8B6A83]">MANAGEMENT</p>
          <h1 className="mt-1 text-3xl font-bold text-[#3A0F34]">
            Students
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add, search, edit and manage student records.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3A0F34] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#54204D]"
        >
          <Plus size={18} />
          Add Student
        </button>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={() => void loadStudents()}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {success && (
        <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      {showForm && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Student' : 'Add New Student'}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Fill in all required fields.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Close form"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Full Name *
              <input
                required
                minLength={2}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Enter student name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3A0F34] focus:ring-2 focus:ring-[#3A0F34]/10"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Email Address *
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="student@example.com"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#3A0F34] focus:ring-2 focus:ring-[#3A0F34]/10"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Course *
              <select
                required
                value={form.course}
                onChange={(event) =>
                  setForm({ ...form, course: event.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3A0F34]"
              >
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Status *
              <select
                required
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as Student['status'],
                  })
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-[#3A0F34]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#3A0F34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#54204D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Save Changes'
                    : 'Add Student'}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students by name..."
              aria-label="Search students by name"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#3A0F34]"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(event) => setCourseFilter(event.target.value)}
            aria-label="Filter by course"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3A0F34]"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <h2 className="font-bold text-slate-900">All Students</h2>
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-[#3A0F34]">
            {filteredStudents.length} records
          </span>
        </div>

        <div className="mt-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading students...
            </p>
          ) : (
            <StudentsTable
              students={filteredStudents}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}

          {!loading && !error && filteredStudents.length === 0 && (
            <p className="py-4 text-center text-sm text-slate-500">
              No students found.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

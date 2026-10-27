
import { useEffect, useState } from 'react'
import { BookOpen, GraduationCap, UserCheck, Users } from 'lucide-react'
import StatCard from '../components/StatCard'
import StudentsTable, { type Student } from '../components/StudentsTable'
import { apiRequest } from '../services/api'

type Course = {
  id: string
  name: string
  description?: string
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError('')

        const [studentData, courseData] = await Promise.all([
          apiRequest<Student[]>('/students'),
          apiRequest<Course[]>('/courses'),
        ])

        setStudents(studentData)
        setCourses(courseData)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load dashboard data.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const activeStudents = students.filter(
    (student) => student.status === 'Active'
  ).length

  const recentEnrollments = [...students].slice(0, 5)

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#8B6A83]">OVERVIEW</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#3A0F34]">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Welcome back! Here is your institute's overview.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Academic session</p>
          <p className="mt-1 font-semibold text-slate-800">2026–2027</p>
        </div>
      </header>

      {loading ? (
        <p className="text-slate-500">Loading dashboard data...</p>
      ) : error ? (
        <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              title="Total Students"
              value={students.length}
              subtitle="Registered students"
              icon={Users}
              accent="bg-purple-100 text-[#3A0F34]"
            />

            <StatCard
              title="Total Courses"
              value={courses.length}
              subtitle="Courses available"
              icon={BookOpen}
              accent="bg-amber-100 text-amber-700"
            />

            <StatCard
              title="Active Students"
              value={activeStudents}
              subtitle="Currently enrolled"
              icon={UserCheck}
              accent="bg-emerald-100 text-emerald-700"
            />
          </section>

          <section>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recent Enrollments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recently added student records.
                </p>
              </div>

              <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                Latest records
              </span>
            </div>

            {recentEnrollments.length > 0 ? (
              <StudentsTable students={recentEnrollments} />
            ) : (
              <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
                No students have been added yet.
              </p>
            )}
          </section>
        </>
      )}

      <section className="rounded-2xl bg-[#3A0F34] p-6 text-white sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-white/60">STUDENTHUB</p>
            <h2 className="mt-2 text-xl font-bold">
              Everything organized in one place.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Manage student records, track courses and keep enrollment
              information organized.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#EAAA00] text-[#3A0F34]">
            <GraduationCap size={36} />
          </div>
        </div>
      </section>
    </div>
  )
}

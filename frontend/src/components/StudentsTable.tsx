
import { Pencil, Trash2, UserRound } from 'lucide-react'

export type Student = {
  id: string
  name: string
  email: string
  course: string
  status: 'Active' | 'Inactive'
}

type StudentsTableProps = {
  students: Student[]
  onEdit?: (student: Student) => void
  onDelete?: (student: Student) => void
}

export default function StudentsTable({
  students,
  onEdit,
  onDelete,
}: StudentsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full `min-w-[650px]` text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Student
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Course
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr key={student.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3A0F34]/10 text-[#3A0F34]">
                      <UserRound size={19} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {student.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {student.course}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      student.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(student)}
                      aria-label={`Edit ${student.name}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(student)}
                      aria-label={`Delete ${student.name}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <p className="font-medium text-slate-600">
                    No students found
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Try changing your search or filter.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

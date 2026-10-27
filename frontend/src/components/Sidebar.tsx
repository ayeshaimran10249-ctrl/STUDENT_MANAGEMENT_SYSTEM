
import { BookOpen, GraduationCap, LayoutDashboard, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
]

export default function Sidebar() {
  return (
    <aside className="w-full shrink-0 bg-[#3A0F34] p-4 text-white md:sticky md:top-0 md:h-screen md:w-64">
      <div className="mb-7 flex items-center gap-3 px-2 py-3">
        <div className="rounded-xl bg-[#EAAA00] p-2 text-[#3A0F34]">
          <GraduationCap size={26} />
        </div>
        <div>
          <h1 className="text-lg font-bold">StudentHub</h1>
          <p className="text-xs text-white/60">Management System</p>
        </div>
      </div>

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-white/50">
        Workspace
      </p>

      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#EAAA00] text-[#3A0F34]'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 hidden rounded-xl border border-white/10 p-4 md:block">
        <p className="text-sm font-semibold">Learning made simple</p>
        <p className="mt-1 text-xs leading-5 text-white/60">
          Manage students, courses and enrollments in one place.
        </p>
      </div>
    </aside>
  )
}

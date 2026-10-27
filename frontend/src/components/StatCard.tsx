
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'

type StatCardProps = {
  title: string
  value: number | string
  subtitle: string
  icon: LucideIcon
  accent: string
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${accent}`}>
          <Icon size={23} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
        <ArrowUpRight size={16} className="text-emerald-600" />
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  )
}

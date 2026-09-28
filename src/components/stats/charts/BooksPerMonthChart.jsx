import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { monthLabelShort } from '../../../utils/dates'

export function BooksPerMonthChart({ counts }) {
  const data = counts.map((count, index) => ({
    month: monthLabelShort(index),
    libros: count,
  }))

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="currentColor" />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="currentColor" />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            cursor={{ fill: 'rgba(124, 58, 237, 0.08)' }}
          />
          <Bar dataKey="libros" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

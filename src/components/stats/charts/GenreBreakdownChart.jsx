import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function GenreBreakdownChart({ data }) {
  const top = data.slice(0, 6)
  const height = Math.max(160, top.length * 36)

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={top}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="currentColor" />
          <YAxis
            type="category"
            dataKey="genre"
            width={90}
            tick={{ fontSize: 11 }}
            stroke="currentColor"
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
            cursor={{ fill: 'rgba(124, 58, 237, 0.08)' }}
          />
          <Bar dataKey="count" fill="#7c3aed" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

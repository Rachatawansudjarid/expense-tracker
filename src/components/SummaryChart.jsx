import { ResponsiveContainer, Tooltip, Treemap } from 'recharts'

const colorPalette = [
  '#38bdf8',
  '#c084fc',
  '#22d3ee',
  '#f97316',
  '#f472b6',
  '#a3e635',
  '#facc15',
  '#818cf8',
]

const mapData = (categoryTotals) =>
  Object.entries(categoryTotals).map(([name, value], index) => ({
    name,
    size: value,
    fill: colorPalette[index % colorPalette.length],
  }))

function SummaryChart({ categoryTotals }) {
  const totals = categoryTotals ?? {}
  const chartData = mapData(totals)

  if (!chartData.length) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 text-sm text-slate-500">
        Once you log expenses, the category breakdown will appear here.
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <Treemap
          data={chartData}
          dataKey="size"
          stroke="#1f2937"
          content={(props) => {
            const { x, y, width, height, name, fill } = props
            const hasRoom = width > 80 && height > 30
            const rawValue =
              name != null && Object.prototype.hasOwnProperty.call(totals, name)
                ? totals[name]
                : undefined
            return (
              <g>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  style={{
                    fill,
                    stroke: '#0f172a',
                    strokeWidth: 1,
                  }}
                  rx={10}
                />
                {hasRoom && (
                  <>
                    <text
                      x={x + width / 2}
                      y={y + height / 2 - 6}
                      textAnchor="middle"
                      className="fill-white text-sm font-semibold"
                    >
                      {name}
                    </text>
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 12}
                      textAnchor="middle"
                      className="fill-slate-200 text-xs"
                    >
                      {rawValue != null ? `$${rawValue.toFixed(2)}` : ''}
                    </text>
                  </>
                )}
              </g>
            )
          }}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '0.75rem',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              color: '#e2e8f0',
              fontSize: '0.75rem',
            }}
            formatter={(value, name) => {
              const numeric = typeof value === 'number' ? value : Number(value ?? 0)
              return [`$${numeric.toFixed(2)}`, name]
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}

export default SummaryChart


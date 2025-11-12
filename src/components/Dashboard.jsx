const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const StatCard = ({ label, value, trend, accent }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-blue-500/5">
    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-2xl font-semibold text-white">{value}</span>
      {trend && (
        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-300">
          {trend}
        </span>
      )}
    </div>
    {accent && <p className="mt-4 text-sm text-slate-400">{accent}</p>}
  </div>
)

function Dashboard({
  totalSpent,
  monthlyBudget,
  transactionsCount,
  averageTransaction,
  peakCategory,
  utilization,
}) {
  const remainingBudget = Math.max(monthlyBudget - totalSpent, 0)
  const budgetTrend =
    utilization > 100
      ? `Over budget by ${Math.round(utilization - 100)}%`
      : `${Math.round(utilization)}% of budget`

  return (
    <section>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total spent"
          value={formatCurrency(totalSpent)}
          accent={`Remaining budget ${formatCurrency(remainingBudget)}`}
        />
        <StatCard
          label="Transactions"
          value={transactionsCount}
          accent={`Average spend ${formatCurrency(averageTransaction || 0)}`}
        />
        <StatCard
          label="Peak category"
          value={peakCategory}
          accent="Largest share of this month’s expenses"
        />
        <StatCard label="Budget usage" value={budgetTrend} trend={transactionsCount ? 'Live' : ''} />
      </div>
    </section>
  )
}

export default Dashboard


const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  }).format(value)

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

function ExpenseList({ expenses, onDeleteExpense, emptyStateMessage }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-800 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Transactions</h2>
          <p className="text-sm text-slate-400">
            Review, validate, and categorize each purchase across your accounts.
          </p>
        </div>
        <span className="text-sm font-medium text-slate-400">
          {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
        </span>
      </header>

      {expenses.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-slate-400">
          {emptyStateMessage ?? 'No expenses yet. Log your first purchase to get started.'}
        </div>
      ) : (
        <ul className="divide-y divide-slate-800">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="group flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-900/80"
            >
              <div>
                <p className="text-sm font-semibold text-white">{expense.description}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 font-medium text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    {expense.category}
                  </span>
                  <span>{formatDate(expense.date)}</span>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4 text-slate-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.76c0-.63.232-1.24.659-1.698l8.25-8.747a1.5 1.5 0 012.182 0l8.25 8.747c.427.458.659 1.068.659 1.698V19.5A2.25 2.25 0 0120 21.75H4.5A2.25 2.25 0 012.25 19.5v-6.74z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 15.75h7.5"
                      />
                    </svg>
                    {expense.paymentMethod}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-blue-300">
                  {formatCurrency(expense.amount)}
                </span>
                <button
                  onClick={() => onDeleteExpense?.(expense.id)}
                  className="invisible flex items-center justify-center rounded-lg border border-transparent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 transition group-hover:visible group-hover:border-slate-700 group-hover:text-red-400 hover:border-red-500 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ExpenseList


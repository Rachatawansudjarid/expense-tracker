import { useMemo, useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import ExpenseForm from './components/ExpenseForm.jsx'
import ExpenseList from './components/ExpenseList.jsx'
import SummaryChart from './components/SummaryChart.jsx'

const categories = [
  'Housing',
  'Food & Groceries',
  'Transportation',
  'Utilities',
  'Health & Wellness',
  'Entertainment',
  'Savings',
  'Other',
]

const defaultExpenses = [
  {
    id: 'exp-001',
    description: 'March Rent',
    amount: 1200,
    category: 'Housing',
    date: '2025-03-01',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'exp-002',
    description: 'Weekly Groceries',
    amount: 86.43,
    category: 'Food & Groceries',
    date: '2025-03-04',
    paymentMethod: 'Debit Card',
  },
  {
    id: 'exp-003',
    description: 'Gym Membership',
    amount: 49.99,
    category: 'Health & Wellness',
    date: '2025-03-05',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'exp-004',
    description: 'Ride Share',
    amount: 18.5,
    category: 'Transportation',
    date: '2025-03-06',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'exp-005',
    description: 'Electric Bill',
    amount: 92.11,
    category: 'Utilities',
    date: '2025-03-08',
    paymentMethod: 'Direct Debit',
  },
  {
    id: 'exp-006',
    description: 'Movie Night',
    amount: 32,
    category: 'Entertainment',
    date: '2025-03-09',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'exp-007',
    description: 'Emergency Fund',
    amount: 150,
    category: 'Savings',
    date: '2025-03-12',
    paymentMethod: 'Bank Transfer',
  },
]

const monthlyBudget = 2500

function App() {
  const [expenses, setExpenses] = useState(defaultExpenses)
  const [categoryFilter, setCategoryFilter] = useState('All categories')
  const [monthFilter, setMonthFilter] = useState('Latest month')
  const [searchTerm, setSearchTerm] = useState('')

  const allMonths = useMemo(() => {
    const unique = new Set(
      expenses.map((expense) => {
        const date = new Date(expense.date)
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      }),
    )
    return Array.from(unique).sort().reverse()
  }, [expenses])

  const activeMonth = useMemo(() => {
    if (monthFilter !== 'Latest month') {
      return monthFilter
    }
    return allMonths[0] ?? ''
  }, [allMonths, monthFilter])

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory =
        categoryFilter === 'All categories' || expense.category === categoryFilter
      const matchesMonth =
        !activeMonth ||
        `${new Date(expense.date).getFullYear()}-${String(new Date(expense.date).getMonth() + 1).padStart(2, '0')}` ===
          activeMonth
      const matchesSearch = expense.description
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
      return matchesCategory && matchesMonth && matchesSearch
    })
  }, [expenses, categoryFilter, activeMonth, searchTerm])

  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [filteredExpenses])

  const totals = useMemo(() => {
    const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount
      return acc
    }, {})
    const peakCategory =
      Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a])[0] ??
      'N/A'
    const averageTransaction = filteredExpenses.length
      ? totalSpent / filteredExpenses.length
      : 0
    const utilization = monthlyBudget ? (totalSpent / monthlyBudget) * 100 : 0

    return {
      totalSpent,
      averageTransaction,
      peakCategory,
      utilization,
      categoryTotals,
    }
  }, [filteredExpenses])

  const handleAddExpense = (expense) => {
    setExpenses((prev) => [
      {
        ...expense,
        id: `exp-${
          globalThis.crypto?.randomUUID?.() ??
          `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        }`,
      },
      ...prev,
    ])
  }

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  return (
    <div className="bg-slate-950 pb-16 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold tracking-wide text-blue-400">
                Smart Expense Tracker
              </p>
              <h1 className="text-3xl font-bold text-white sm:text-4xl">Monthly spending</h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className="w-48 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="Latest month">Latest month</option>
                {allMonths.map((month) => (
                  <option key={month} value={month}>
                    {new Date(`${month}-01`).toLocaleDateString(undefined, {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </option>
                ))}
              </select>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-52 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="All categories">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative flex w-full items-center">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-3.873-3.873m0 0A7.125 7.125 0 105.25 5.25a7.125 7.125 0 0011.877 11.877z"
                />
              </svg>
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Search transactions…"
              type="search"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-10 px-6">
        <Dashboard
          totalSpent={totals.totalSpent}
          monthlyBudget={monthlyBudget}
          transactionsCount={filteredExpenses.length}
          averageTransaction={totals.averageTransaction}
          peakCategory={totals.peakCategory}
          utilization={totals.utilization}
        />

        <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-10">
            <ExpenseForm categories={categories} onAddExpense={handleAddExpense} />
            <ExpenseList
              expenses={sortedExpenses}
              emptyStateMessage={
                filteredExpenses.length === 0
                  ? 'No expenses match your filters yet. Add a new transaction or adjust the filters to see more activity.'
                  : undefined
              }
              onDeleteExpense={handleDeleteExpense}
            />
          </div>

          <aside className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Spending by category</h2>
              <p className="mt-1 text-sm text-slate-400">
                Track which categories are driving your monthly spending.
              </p>
            </div>

            <SummaryChart categoryTotals={totals.categoryTotals} />

            <div className="space-y-3">
              {Object.entries(totals.categoryTotals)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-200">{category}</span>
                    <span className="font-semibold text-blue-300">${amount.toFixed(2)}</span>
                  </div>
                ))}
              {Object.keys(totals.categoryTotals).length === 0 && (
                <p className="text-sm text-slate-500">Add an expense to populate the chart.</p>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App

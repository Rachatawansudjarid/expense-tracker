import { useMemo, useState } from 'react'

const defaultForm = {
  description: '',
  amount: '',
  category: '',
  date: '',
  paymentMethod: 'Credit Card',
}

const paymentMethods = ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Digital Wallet']

const formatLocalDate = (isoDate) => {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
  return date.toISOString().split('T')[0]
}

function ExpenseForm({ categories, onAddExpense }) {
  const [formState, setFormState] = useState({
    ...defaultForm,
    date: new Date().toISOString().split('T')[0],
    category: categories[0] ?? '',
  })
  const [errors, setErrors] = useState({})
  const parsedAmount = useMemo(() => Number.parseFloat(formState.amount), [formState.amount])
  const hasValidAmount = Number.isFinite(parsedAmount) && parsedAmount > 0
  const isSubmitDisabled = useMemo(() => {
    return (
      !formState.description.trim() ||
      !hasValidAmount ||
      !formState.category ||
      !formState.date
    )
  }, [formState, hasValidAmount])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const nextErrors = {}
    if (!formState.description.trim()) {
      nextErrors.description = 'Description is required.'
    }
    if (!hasValidAmount) {
      nextErrors.amount = 'Enter a positive amount.'
    }
    if (!formState.date) {
      nextErrors.date = 'Select the transaction date.'
    }
    if (!formState.category) {
      nextErrors.category = 'Choose a category.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) {
      return
    }

    onAddExpense({
      description: formState.description.trim(),
      amount: parsedAmount,
      category: formState.category,
      date: formState.date,
      paymentMethod: formState.paymentMethod,
    })

    setFormState((prev) => ({
      ...defaultForm,
      category: prev.category,
      date: prev.date,
    }))
    setErrors({})
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg shadow-blue-500/5">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Log a new expense</h2>
          <p className="text-sm text-slate-400">
            Keep your spending on track by capturing purchases as they happen.
          </p>
        </div>
        <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
          Real-time
        </span>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            name="description"
            value={formState.description}
            onChange={handleChange}
            placeholder="e.g. Grocery run at Fresh Market"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            autoComplete="off"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-400">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="amount">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
              $
            </span>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formState.amount}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2 pl-7 pr-4 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formatLocalDate(formState.date)}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-300" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formState.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category}</p>}
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-slate-300"
            htmlFor="paymentMethod"
          >
            Payment method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formState.paymentMethod}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Pro tip: Snap receipts and store them in your cloud drive to pair with each expense.
          </p>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 disabled:cursor-not-allowed disabled:bg-blue-500/50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add expense
          </button>
        </div>
      </form>
    </section>
  )
}

export default ExpenseForm


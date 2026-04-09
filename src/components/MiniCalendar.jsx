import { useState } from "react"

export default function MiniCalendar({ currentMonth, currentYear, onSelect, onClose }) {
  const [navYear, setNavYear] = useState(currentYear)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const today = new Date()

  return (
    <div className="mini-cal-backdrop" onClick={onClose}>
      <div className="mini-cal" onClick={e => e.stopPropagation()}>
        <div className="mini-cal-header">
          <button onClick={() => setNavYear(y => y - 1)} aria-label="Previous year">‹</button>
          <span className="mini-cal-year">{navYear}</span>
          <button onClick={() => setNavYear(y => y + 1)} aria-label="Next year">›</button>
        </div>
        <div className="mini-cal-grid">
          {months.map((m, i) => {
            const isActive = i === currentMonth && navYear === currentYear
            const isCurrent = i === today.getMonth() && navYear === today.getFullYear()
            return (
              <button
                key={m}
                className={`mini-cal-month${isActive ? " active" : ""}${isCurrent ? " current" : ""}`}
                onClick={() => onSelect(i, navYear)}
              >
                {m}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

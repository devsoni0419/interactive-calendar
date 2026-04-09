
function spawnConfetti(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const colors = ["#ff6b6b","#feca57","#48dbfb","#ff9ff3","#54a0ff","#5f27cd","#1dd1a1"]

  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div")
    p.className = "confetti-particle"
    p.style.left = cx + "px"
    p.style.top = cy + "px"
    p.style.background = colors[Math.floor(Math.random() * colors.length)]
    p.style.width = (4 + Math.random() * 6) + "px"
    p.style.height = (4 + Math.random() * 6) + "px"
    p.style.setProperty("--tx", (Math.random() - 0.5) * 180 + "px")
    p.style.setProperty("--ty", -(Math.random() * 120 + 30) + "px")
    p.style.setProperty("--r", (Math.random() * 720 - 360) + "deg")
    p.style.animationDelay = (Math.random() * 0.15) + "s"
    document.body.appendChild(p)
    setTimeout(() => p.remove(), 1200)
  }
}

export default function DayCell({ day, start, end, isToday, isWeekend, holiday, hasNotes, notePreview, onClick, onDragStart, onDragEnter, monthName }) {
  if (!day) return <div className="cell empty" />

  let className = "cell"

  if (day === start && end) className += " start"
  else if (day === end) className += " end"
  else if (start && end && day > Math.min(start, end) && day < Math.max(start, end)) className += " in-range"
  else if (day === start && !end) className += " start"

  if (isToday) className += " today"
  if (holiday) className += " holiday"
  if (hasNotes) className += " has-notes"
  if (isWeekend) className += " weekend"

  const tooltipText = notePreview.length > 0
    ? notePreview.slice(0, 2).join(" • ").substring(0, 80) + (notePreview.length > 2 ? "…" : "")
    : undefined

  const handleCellClick = (e) => {
    if (holiday) spawnConfetti(e)
    onClick(day)
  }


  return (
    <div
      className={className}
      onClick={handleCellClick}
      onMouseDown={(e) => { e.preventDefault(); onDragStart(day) }}
      onMouseEnter={() => onDragEnter(day)}
      role="button"
      tabIndex={0}
      aria-label={`${monthName} ${day}${isToday ? ", today" : ""}${holiday ? `, ${holiday}` : ""}${hasNotes ? ", has notes" : ""}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCellClick(e) } }}
      data-tooltip={tooltipText}
    >
      <span className="day-number">{day}</span>
      {holiday && <span className="holiday-name">{holiday}</span>}
      {hasNotes && !holiday && <span className="note-dot" aria-hidden="true" />}
    </div>
  )
}
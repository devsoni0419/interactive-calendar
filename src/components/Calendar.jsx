import { useState, useEffect, useCallback, useRef } from "react"
import { getMonthDays } from "../utils/calendar"
import { getHoliday } from "../utils/holidays"
import DayCell from "./DayCell"
import NotesPanel from "./NotesPanel"
import MiniCalendar from "./MiniCalendar"

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
]
const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=1200&h=600&fit=crop", // Jan - Snow
  "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&h=600&fit=crop", // Feb - Winter
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=1200&h=600&fit=crop", // Mar - Spring Blossom
  "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&h=600&fit=crop", // Apr - Tulips
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=600&fit=crop", // May - Lush Green
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop", // Jun - Beach
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=600&fit=crop", // Jul - Summer Sky
  "https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=1200&h=600&fit=crop", // Aug - Golden Wheat
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop", // Sep - Autumn Forest
  "https://images.unsplash.com/photo-1476990789491-712b869b91a5?w=1200&h=600&fit=crop", // Oct - Autumn Leaves
  "https://images.unsplash.com/photo-1477322524744-0eece9e79640?w=1200&h=600&fit=crop", // Nov - Moody Fog
  "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1200&h=600&fit=crop"  // Dec - Winter Night
]


const SEASON_ICONS = {
  winter: ["❄", "❅", "❆", "✦"],
  spring: ["🌸", "✿", "❀", "🌺"],
  summer: ["☀", "✧", "⋆", "✦"],
  autumn: ["🍂", "🍁", "🍃", "✿"]
}

function getSeason(month) {
  if ([11, 0, 1].includes(month)) return "winter"
  if ([2, 3, 4].includes(month)) return "spring"
  if ([5, 6, 7].includes(month)) return "summer"
  return "autumn"
}

export default function Calendar() {
  const today = new Date()

  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes")
    return saved ? JSON.parse(saved) : {}
  })
  const [dark, setDark] = useState(false)
  const [flipClass, setFlipClass] = useState("")
  const [heroFading, setHeroFading] = useState(false)
  const [showMiniCal, setShowMiniCal] = useState(false)
  const [toast, setToast] = useState(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const dragOriginRef = useRef(null)
  const wasDraggedRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const toastTimerRef = useRef(null)
  const wrapperRef = useRef(null)

  const days = getMonthDays(year, month)
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear()
  const todayDay = isCurrentMonth ? today.getDate() : null

  const season = getSeason(month)
  const seasonIcons = SEASON_ICONS[season]

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = MONTH_IMAGES[month]
    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = 1
      canvas.height = 1
      ctx.drawImage(img, 0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data

      const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        let h, s, l = (max + min) / 2
        if (max === min) { h = s = 0 }
        else {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
          }
          h /= 6
        }
        return [h * 360, s * 100, l * 100]
      }

      const [h, s, l] = rgbToHsl(r, g, b)
      const el = wrapperRef.current
      if (!el) return

      // Calibrate saturation and lightness for UI
      const finalS = Math.min(Math.max(s, 30), 70)
      const finalL = Math.min(Math.max(l, 30), 50)

      const accentColor = `hsl(${h}, ${finalS}%, ${finalL}%)`
      const accentDark = `hsl(${h}, ${finalS + 5}%, ${finalL - 8}%)`
      const accentText = dark ? `hsl(${h}, ${s - 10}%, 85%)` : `hsl(${h}, ${s}%, 20%)`
      
      const bgTint = dark 
        ? `hsl(${h}, ${Math.min(s, 20)}%, 10%)` 
        : `hsl(${h}, ${Math.min(s, 15)}%, 98%)`
      const secondaryTint = dark
        ? `hsl(${h}, ${Math.min(s, 25)}%, 14%)`
        : `hsl(${h}, ${Math.min(s, 20)}%, 94%)`
      const cardTint = dark
        ? `hsl(${h}, ${Math.min(s, 25)}%, 18%)`
        : `hsl(${h}, ${Math.min(s, 20)}%, 100%)`
      
      const bodyBg = dark
        ? `linear-gradient(135deg, hsl(${h}, ${Math.min(s, 20)}%, 8%) 0%, hsl(${h}, ${Math.min(s, 15)}%, 4%) 100%)`
        : `linear-gradient(135deg, hsl(${h}, ${Math.min(s, 10)}%, 96%) 0%, hsl(${h}, ${Math.min(s, 5)}%, 92%) 100%)`

      el.style.setProperty("--accent", accentColor)
      el.style.setProperty("--accent-dark", accentDark)
      el.style.setProperty("--accent-text", accentText)
      el.style.setProperty("--bg", bgTint)
      el.style.setProperty("--bg-secondary", secondaryTint)
      el.style.setProperty("--bg-card", cardTint)
      document.documentElement.style.setProperty("--body-bg", bodyBg)
      
      // Update holiday/weekend colors based on theme if too close to red
      if (h > 330 || h < 20) {
        el.style.setProperty("--holiday", `hsl(${(h + 40) % 360}, 70%, 50%)`)
      } else {
        el.style.setProperty("--holiday", "#d63031")
      }
    }
  }, [month, dark])

  useEffect(() => {
    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
  }, [])

  useEffect(() => { document.body.className = dark ? "dark-body" : "" }, [dark])
  useEffect(() => { localStorage.setItem("notes", JSON.stringify(notes)) }, [notes])

  useEffect(() => {
    const handler = () => { dragOriginRef.current = null }
    window.addEventListener("mouseup", handler)
    return () => window.removeEventListener("mouseup", handler)
  }, [])

  const showToastMsg = useCallback((message, icon = "⌨️") => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, icon, id: Date.now() })
    toastTimerRef.current = setTimeout(() => setToast(null), 2000)
  }, [])

  const animateTransition = (updateFn) => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    setHeroFading(true)
    setFlipClass("flip-out")
    setTimeout(() => {
      updateFn()
      setStart(null)
      setEnd(null)
      setFlipClass("flip-in")
      setHeroFading(false)
      setTimeout(() => { setFlipClass(""); isAnimatingRef.current = false }, 400)
    }, 300)
  }

  const changeMonth = (dir) => {
    animateTransition(() => {
      if (dir === "prev") {
        if (month === 0) { setMonth(11); setYear(y => y - 1) }
        else setMonth(m => m - 1)
      } else {
        if (month === 11) { setMonth(0); setYear(y => y + 1) }
        else setMonth(m => m + 1)
      }
    })
  }

  const changeYear = (dir) => {
    animateTransition(() => setYear(y => y + dir))
  }

  const goToToday = () => {
    if (isCurrentMonth) return
    animateTransition(() => {
      setMonth(today.getMonth())
      setYear(today.getFullYear())
    })
  }

  const handleMiniCalSelect = (newMonth, newYear) => {
    setShowMiniCal(false)
    if (newMonth === month && newYear === year) return
    animateTransition(() => { setMonth(newMonth); setYear(newYear) })
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault(); changeMonth("prev"); showToastMsg("Previous Month", "◀"); break
        case "ArrowRight":
          e.preventDefault(); changeMonth("next"); showToastMsg("Next Month", "▶"); break
        case "t": case "T":
          goToToday(); showToastMsg("Jump to Today", "📅"); break
        case "d": case "D":
          setDark(prev => !prev)
          showToastMsg(!dark ? "Dark Mode" : "Light Mode", !dark ? "🌙" : "☀️"); break
        case "?":
          setShowShortcuts(prev => !prev); break
        case "Escape":
          setShowShortcuts(false); setShowMiniCal(false); break
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [month, year, dark])

  const dayHasNotes = useCallback((day) => {
    const prefix = `${month}-${year}`
    const singleKey = `${prefix}-${day}`
    const singleData = notes[singleKey]
    if (singleData && (Array.isArray(singleData) ? singleData.length > 0 : true)) return true
    for (const key of Object.keys(notes)) {
      if (key.startsWith(prefix) && key !== `${prefix}-global`) {
        const parts = key.split("-")
        if (parts.length === 4) {
          const rs = parseInt(parts[2]), re = parseInt(parts[3])
          if (day >= rs && day <= re) {
            const nd = notes[key]
            if (Array.isArray(nd) ? nd.length > 0 : nd) return true
          }
        }
      }
    }
    return false
  }, [month, year, notes])


  const getNotesForDay = useCallback((day) => {
    const results = []
    const prefix = `${month}-${year}`
    const singleKey = `${prefix}-${day}`
    if (notes[singleKey]) {
      const list = Array.isArray(notes[singleKey]) ? notes[singleKey] : [{ text: notes[singleKey] }]
      list.forEach(n => results.push(n.text))
    }
    for (const key of Object.keys(notes)) {
      if (key.startsWith(prefix) && key !== singleKey && key !== `${prefix}-global`) {
        const parts = key.split("-")
        if (parts.length === 4) {
          const rs = parseInt(parts[2]), re = parseInt(parts[3])
          if (day >= rs && day <= re) {
            const list = Array.isArray(notes[key]) ? notes[key] : [{ text: notes[key] }]
            list.forEach(n => results.push(n.text))
          }
        }
      }
    }
    return results
  }, [month, year, notes])

  const handleClick = (day) => {
    if (wasDraggedRef.current) { wasDraggedRef.current = false; return }
    if (!start || (start && end)) { setStart(day); setEnd(null) }
    else {
      if (day < start) { setEnd(start); setStart(day) }
      else if (day === start) { setStart(null); setEnd(null) }
      else { setEnd(day) }
    }
  }

  const handleDragStart = (day) => { dragOriginRef.current = day; wasDraggedRef.current = false }
  const handleDragEnter = (day) => {
    if (dragOriginRef.current === null) return
    if (day !== dragOriginRef.current) {
      wasDraggedRef.current = true
      const origin = dragOriginRef.current
      setStart(Math.min(origin, day))
      setEnd(Math.max(origin, day))
    }
  }

  const totalDays = new Date(year, month + 1, 0).getDate()
  const holidayCount = Array.from({ length: totalDays }, (_, i) => i + 1)
    .filter(d => getHoliday(month, d, year)).length
  const noteCount = Object.keys(notes).filter(k => k.startsWith(`${month}-${year}`))
    .reduce((sum, k) => {
      const v = notes[k]
      return sum + (Array.isArray(v) ? v.length : (v ? 1 : 0))
    }, 0)
  const daysRemaining = isCurrentMonth ? totalDays - today.getDate() : null

  return (
    <div className={dark ? "calendar-wrapper dark" : "calendar-wrapper"} ref={wrapperRef}>

      <div className="spiral-binding" aria-hidden="true">
        {Array.from({ length: 13 }, (_, i) => (
          <div key={i} className="spiral-hole"><div className="spiral-ring" /></div>
        ))}
      </div>

      <div className={`hero ${heroFading ? "fading" : ""}`}>
        <img src={MONTH_IMAGES[month]} alt={`${MONTH_NAMES[month]} scenery`} />
        <div className="seasonal-particles" aria-hidden="true">
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={`${season}-${i}`}
              className={`season-particle season-${season}`}
              style={{
                left: `${8 + i * 13}%`,
                animationDelay: `${i * 0.9}s`,
                fontSize: `${12 + (i % 3) * 4}px`
              }}
            >
              {seasonIcons[i % seasonIcons.length]}
            </span>
          ))}
        </div>
        <div className="overlay">
          <div className="month-controls">
            <button onClick={() => changeMonth("prev")} aria-label="Previous month">◀</button>
            <div className="month-year-display" onClick={() => setShowMiniCal(true)}>
              <h2>{MONTH_NAMES[month]}</h2>
              <div className="year-controls">
                <button className="year-btn" onClick={(e) => { e.stopPropagation(); changeYear(-1) }} aria-label="Previous year">‹</button>
                <span className="year-text">{year}</span>
                <button className="year-btn" onClick={(e) => { e.stopPropagation(); changeYear(1) }} aria-label="Next year">›</button>
              </div>
            </div>
            <button onClick={() => changeMonth("next")} aria-label="Next month">▶</button>
          </div>
        </div>
        <div className="hero-actions">
          {!isCurrentMonth && (
            <button className="today-btn" onClick={goToToday}>📅 Today</button>
          )}
          <button className="theme-toggle" onClick={() => setDark(!dark)}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button className="shortcuts-btn" onClick={() => setShowShortcuts(true)} aria-label="Keyboard shortcuts">
            ⌨️
          </button>
        </div>
      </div>

      <div className="calendar-body">
        <NotesPanel
          start={start} end={end} month={month} year={year}
          notes={notes} setNotes={setNotes}
          onSave={() => { setStart(null); setEnd(null) }}
        />
        <div className={`grid-wrapper ${flipClass}`}>
          <div className="grid" role="grid" aria-label="Calendar grid">
            {DAY_NAMES.map((dn, i) => (
              <div key={dn} className={`day-header ${i >= 5 ? "weekend" : ""}`} role="columnheader">{dn}</div>
            ))}
            {days.map((d, i) => (
              <DayCell
                key={i} day={d} start={start} end={end}
                isToday={d === todayDay}
                isWeekend={i % 7 >= 5}
                holiday={d ? getHoliday(month, d, year) : null}
                hasNotes={d ? dayHasNotes(d) : false}
                notePreview={d ? getNotesForDay(d) : []}
                onClick={handleClick}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                monthName={MONTH_NAMES[month]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-value">{totalDays}</span>
          <span className="stat-label">Days</span>
        </div>
        <div className="stat">
          <span className="stat-value">{holidayCount}</span>
          <span className="stat-label">Holidays</span>
        </div>
        <div className="stat">
          <span className="stat-value">{noteCount}</span>
          <span className="stat-label">Notes</span>
        </div>
        {daysRemaining !== null && (
          <div className="stat highlight">
            <span className="stat-value">{daysRemaining}</span>
            <span className="stat-label">Remaining</span>
          </div>
        )}
      </div>

      {showMiniCal && (
        <MiniCalendar
          currentMonth={month}
          currentYear={year}
          onSelect={handleMiniCalSelect}
          onClose={() => setShowMiniCal(false)}
        />
      )}

      {toast && (
        <div className="toast" key={toast.id}>
          <span className="toast-icon">{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {showShortcuts && (
        <div className="shortcuts-backdrop" onClick={() => setShowShortcuts(false)}>
          <div className="shortcuts-modal" onClick={e => e.stopPropagation()}>
            <h3>⌨️ Keyboard Shortcuts</h3>
            <div className="shortcut-list">
              <div className="shortcut-row"><kbd>←</kbd><span>Previous Month</span></div>
              <div className="shortcut-row"><kbd>→</kbd><span>Next Month</span></div>
              <div className="shortcut-row"><kbd>T</kbd><span>Jump to Today</span></div>
              <div className="shortcut-row"><kbd>D</kbd><span>Toggle Dark Mode</span></div>
              <div className="shortcut-row"><kbd>?</kbd><span>Toggle Shortcuts</span></div>
              <div className="shortcut-row"><kbd>Esc</kbd><span>Close Popups</span></div>
            </div>
            <p className="shortcuts-hint">Click month name for quick navigator</p>
          </div>
        </div>
      )}
    </div>
  )
}
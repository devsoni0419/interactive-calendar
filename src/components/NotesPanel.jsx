import { useState } from "react"

export default function NotesPanel({ start, end, month, year, notes, setNotes, onSave }) {
  let currentKey = `${month}-${year}-global`
  let noteTitle = "General Note"

  if (start && end) {
    currentKey = `${month}-${year}-${start}-${end}`
    noteTitle = `Note for ${start} - ${end}`
  } else if (start) {
    currentKey = `${month}-${year}-${start}`
    noteTitle = `Note for Day ${start}`
  }

  const [currentDraft, setCurrentDraft] = useState("")

  const saveNote = () => {
    if (!currentDraft.trim()) return
    const newNote = { id: Date.now(), text: currentDraft.trim() }

    let existing = notes[currentKey] || []
    if (typeof existing === "string") existing = [{ id: Date.now() - 1000, text: existing }]

    setNotes(prev => ({ ...prev, [currentKey]: [...existing, newNote] }))
    setCurrentDraft("")
    if (onSave) onSave()
  }

  const deleteNote = (key, id) => {
    let existing = notes[key] || []
    if (typeof existing === "string") existing = [{ id: Date.now() - 1000, text: existing }]
    const updatedList = existing.filter(note => note.id !== id)
    setNotes(prev => ({ ...prev, [key]: updatedList }))
  }

  const monthPrefix = `${month}-${year}`
  const allNotes = []

  Object.keys(notes).forEach(k => {
    if (k.startsWith(monthPrefix)) {
      const parts = k.split("-")
      let label = "General"
      if (parts[2] !== "global") {
        if (parts.length === 3) label = `Day ${parts[2]}`
        else if (parts.length === 4) label = `Day ${parts[2]} - ${parts[3]}`
      }

      let list = notes[k]
      if (typeof list === "string" && list) {
        list = [{ id: Date.now() + Math.random(), text: list }]
      }

      if (Array.isArray(list)) {
        list.forEach(note => {
          allNotes.push({ ...note, key: k, label })
        })
      }
    }
  })

  allNotes.sort((a, b) => a.id - b.id)

  return (
    <div className="notes">
      <div className="notes-header">
        <h3>Month's Notes</h3>
      </div>

      <div className="notes-list">
        {allNotes.length === 0 ? (
          <p className="no-notes">No notes this month yet...</p>
        ) : (
          allNotes.map(note => (
            <div key={`${note.key}-${note.id}`} className="note-card">
              <div className="note-content-wrapper">
                <span className="note-tag">{note.label}</span>
                <p>{note.text}</p>
              </div>
              <button className="delete-btn" onClick={() => deleteNote(note.key, note.id)}>🗑️</button>
            </div>
          ))
        )}
      </div>

      <div className="note-input-area">
        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#888", marginBottom: "6px" }}>
          Adding: {noteTitle}
        </div>
        <textarea
          value={currentDraft}
          onChange={(e) => setCurrentDraft(e.target.value)}
          placeholder="Write a new note..."
        />
        <button className="save-btn" onClick={saveNote}>Save Note</button>
      </div>
    </div>
  )
}
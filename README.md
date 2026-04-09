# 🗓️ Interactive Wall Calendar

**Official Repository**: [https://github.com/devsoni0419/interactive-calendar](https://github.com/devsoni0419/interactive-calendar)  
**Live Application**: [https://interactive-calendar-zeta-lovat.vercel.app/](https://interactive-calendar-zeta-lovat.vercel.app/)

---

A premium, highly interactive React calendar component designed to mimic the tactile feel of a physical wall calendar. This project balances modern aesthetics like glassmorphism and HSL-based dynamic themes with robust functionality for planning and date management.

## ✨ Key Features

- 🎨 **Dynamic Theme Engine**  
  Intelligent HSL palette extraction from monthly hero images ensuring the UI (backgrounds, accents, and text) is always in harmony with the current season's scenery.

- 🌬️ **Seasonal Atmosphere**  
  Month-specific interactive particles (Snowflakes for Winter, Blossoms for Spring, Sparkles for Summer, and Autumn Leaves) to create an immersive user experience.

- 📅 **Intuitive Range Selection**  
  Select date ranges seamlessly via click-to-range or natural mouse-drag gestures, ideal for booking or multi-day event planning.

- 📝 **Advanced Notes System**  
  Dual-layered organization:
  - **Month Notes**: Global objectives for the entire month.
  - **Selection Notes**: Pin specific notes to a date or a selected range.

- ✨ **Physical Metaphor UI**  
  Authentic spiral binding design and smooth page-flip animations that simulate turning the page of a high-end wall calendar.

- 🇮🇳 **Localized Holiday Data**  
  Pre-integrated Indian holiday calendar covering 2026 and 2027.

- 🌙 **Adaptive Appearance**  
  Deeply integrated Light/Dark modes that automatically sync with system preferences while allowing for instant manual toggles.

- ⚡ **Power-User Shortcuts**  
  Engineered for speed with a comprehensive set of keyboard shortcuts for navigation and theme toggling.

---

## 🛠️ Modern Tech Stack

- **React 19**: Utilizing the latest React features for efficient state management and performance.
- **Vite 8**: Leveraging the next generation of build tools for lightning-fast development.
- **Vanilla CSS**: Pure CSS Variables and HSL logic for a lightweight, high-performance styling system without the overhead of external frameworks.
- **Persistence**: Automated `LocalStorage` synchronization ensuring your notes and theme preferences are saved locally without needing a backend.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `←` / `→` | Navigate Previous / Next Month |
| `T` | Snap to Today's Date |
| `D` | Toggle Dark / Light Mode |
| `?` | Toggle Help & Shortcut Modal |
| `Esc` | Close all Popups and Modals |

---

## 📂 Project Architecture

* `src/components/` → Modular component architecture for the Calendar grid, Day cells, and Notes.
* `src/utils/` → Centralized logic for date calculations and holiday data.
* `src/App.css` → Highly optimized design system using CSS Variables for theme switching.

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/devsoni0419/interactive-calendar.git
cd interactive-calendar
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

---

## 📌 Future Roadmap

* **Multi-Device Sync**: Optional backend integration for cross-device note synchronization.
* **External Integrations**: Real-time sync with Google Calendar and Outlook.
* **Data Management**: Export and Import functionality for notes (JSON/CSV).
* **Extended Holiday Support**: Support for international holiday packs.

---
*Built with passion for elegant, functional frontend engineering.*

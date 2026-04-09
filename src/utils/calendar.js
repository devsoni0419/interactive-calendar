export function getMonthDays(year, month) {
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
  const totalDays = new Date(year, month + 1, 0).getDate()

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= totalDays; d++) days.push(d)

  return days
}
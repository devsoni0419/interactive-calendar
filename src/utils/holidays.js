


const staticHolidays = {
  "0-1": "New Year's Day",
  "0-26": "Republic Day",
  "1-19": "Shivaji Jayanti",
  "3-14": "Ambedkar Jayanti",
  "4-1": "Labour Day",
  "7-15": "Independence Day",
  "9-2": "Gandhi Jayanti",
  "11-25": "Christmas Day"
};


const variableHolidays = {
  2026: {
    "2-3": "Holi",
    "2-20": "Eid-ul-Fitr",
    "3-2": "Mahavir Jayanti",
    "3-3": "Good Friday",
    "4-1": "Labour Day / Buddha Purnima",
    "5-27": "Eid-ul-Zuha (Bakrid)",
    "6-26": "Muharram",
    "7-27": "Janmashtami",
    "8-30": "Raksha Bandhan",
    "9-14": "Ganesh Chaturthi",
    "9-20": "Dussehra",
    "10-8": "Diwali",
    "10-24": "Guru Nanak Jayanti"
  },
  2027: {
    "2-22": "Holi",
    "2-10": "Eid-ul-Fitr",
    "3-21": "Mahavir Jayanti",
    "2-26": "Good Friday",
    "4-20": "Buddha Purnima",
    "5-17": "Eid-ul-Zuha (Bakrid)",
    "6-16": "Muharram",
    "7-25": "Janmashtami",
    "7-18": "Raksha Bandhan",
    "8-4": "Ganesh Chaturthi",
    "9-9": "Dussehra",
    "9-29": "Diwali",
    "10-14": "Guru Nanak Jayanti"
  }
};


export function getHoliday(month, day, year) {
  const key = `${month}-${day}`;
  

  if (variableHolidays[year] && variableHolidays[year][key]) {
    return variableHolidays[year][key];
  }
  

  return staticHolidays[key] || null;
}

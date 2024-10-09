export const includesFilter = (list, key) => {
  return list.includes(key)
}

export const notIncludesFilter = (list, key) => {
  return !list.includes(key)
}

const getMonthDays = month => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31
    case 4:
    case 6:
    case 9:
    case 11:
      return 30
    case 2:
      return 28
  }
}

export const dateInFilter = (dateValue, filter) => {
  let startTime, endTime, startStamp, endStamp, day, date, month
  const today = new Date()
  const oneWeek = 7 * 86400000

  switch (filter) {
    case 1:
      startTime = new Date().setHours(0, 0, 0, 0)
      endTime = new Date().setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
    case 2:
      startStamp = Date.parse(today) + 86400000
      startTime = new Date(startStamp).setHours(0, 0,0 , 0)
      endTime = today.setHours(0, 0, 0, 0)
      return dateValue >= startTime && dateValue < endTime
    case 3:
      startStamp = Date.parse(today) - 86400000
      startTime = new Date(startStamp).setHours(0, 0,0 , 0)
      endTime = today.setHours(0, 0, 0, 0)
      return dateValue >= startTime && dateValue < endTime
    case 4:
      day = today.getDay()
      startStamp = Date.parse(today) - (86400000 * (day - 1))
      endStamp = Date.parse(today) + (86400000 * (7 - day))
      startTime = new Date(startStamp).setHours(0, 0, 0, 0)
      endTime = new Date(endStamp).setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
    case 5:
      day = today.getDay()
      startStamp = Date.parse(today) - (86400000 * (day - 1)) - oneWeek
      endStamp = Date.parse(today) + (86400000 * (7 - day)) - oneWeek
      startTime = new Date(startStamp).setHours(0, 0, 0, 0)
      endTime = new Date(endStamp).setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
    case 6:
      date = today.getDate()
      month = today.getMonth() + 1
      startStamp = Date.parse(today) - (86400000 * (date - 1))
      endStamp = Date.parse(today) + (86400000 * (getMonthDays(month) - date))
      startTime = new Date(startStamp).setHours(0, 0, 0, 0)
      endTime = new Date(endStamp).setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
    case 7:
      date = today.getDate()
      month = today.getMonth()
      startStamp = Date.parse(today) - (86400000 * (date - 1)) - (86400000 * getMonthDays(month))
      endStamp = Date.parse(today) + (86400000 * (getMonthDays(month) - date)) - (86400000 * getMonthDays(month))
      startTime = new Date(startStamp).setHours(0, 0, 0, 0)
      endTime = new Date(endStamp).setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
    case 8:
      startStamp = Date.parse(today) - (86400000 * 7)
      startTime = new Date(startStamp).setHours(0, 0, 0, 0)
      endTime = today.setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
    case 9:
      endStamp = Date.parse(today) + (86400000 * 7)
      startTime = today.setHours(0, 0, 0, 0)
      endTime = new Date(endStamp).setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
    case 10:
      startStamp = Date.parse(today) - (86400000 * 30)
      startTime = new Date(startStamp).setHours(0, 0, 0, 0)
      endTime = today.setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
    case 11:
      endStamp = Date.parse(today) + (86400000 * 30)
      startTime = today.setHours(0, 0, 0, 0)
      endTime = new Date(endStamp).setHours(23, 59, 59, 99)
      return dateValue >= startTime && dateValue < endTime
  }
}
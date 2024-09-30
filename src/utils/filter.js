export const includesFilter = (list, key) => {
  return list.includes(key)
}

export const notIncludesFilter = (list, key) => {
  return !list.includes(key)
}

export const dateInFilter = (dateValue, dateRange) => {
  return dateValue >= dateRange[0] && dateValue <= dateRange[1]
}
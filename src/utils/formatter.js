/**
 * 数字格式化
 * @param {string} format sdk返回数字格式字符串
 * @param {number} value sdk返回数字原始值
 */
export const numbField = (format, value) => {
  switch (format) {
    case '#,##0':
      return value.toLocaleString()
    case '#,##0.00':
      return Number(value.toFixed(2)).toLocaleString()
    case '0':
      return value.toFixed()
    case '0.0':
    case '0.00':
    case '0.000':
    case '0.0000':
    case '0.00000':
    case '0.000000':
    case '0.0000000':
    case '0.00000000':
    case '0.000000000':
      const len = format.split('.')[1].length
      return value.toFixed(len)
    case '0%':
      return `${(value * 100).toFixed()}%`
    case '0.00%':
      return `${(value * 100).toFixed(2)}%`
  }
}

export const tagColorList = [
  'green',
  'amber',
  'blue',
  'cyan',
  'grey',
  'indigo',
  'light-blue',
  'light-green',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'violet',
  'yellow',
  'white'
]

/**
 * 货币符号格式
 */
export const currency = {
  'CNY': '¥',
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'AED': 'dh',
  'AUD': '$',
  'BRL': 'R$',
  'CAD': '$',
  'CHF': 'CHF',
  'HKD': '$',
  'INR': '₹',
  'IDR': 'Rp',
  'JPY': '¥',
  'KRW': '₩',
  'MOP': 'MOP$',
  'MXN': '$',
  'MYR': 'RM',
  'PHP': '₱',
  'PLN': 'zł',
  'RUB': '₽',
  'SGD': '$',
  'THB': '฿',
  'TRY': '₺',
  'TWD': 'NT$',
  'VND': '₫',
}
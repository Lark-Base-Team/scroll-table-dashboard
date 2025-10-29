export const my_plat = () => {
  if (/Mobi|Android|iPhone/i.test(window.navigator.userAgent)) return "phone";
  return "pc";
}

export const line_computed = (config) => {
  return {
    pc: config.pc_line,
    phone: config.phone_line,
  }[my_plat(config)];
} // 实时计算当前展示的行数

export const scroll_computed = (config) => {
  return {
    line: 1,
    page: line_computed(config),
  }[config.scroll_method];
} // 实时计算当前需要滚动的行数

export const show_columns = (config) => {
  return my_plat() === 'pc'
    ? config.show_fields
    : config.show_fields.filter(d => d.is_phone_filed)
}
const config = {
  is_allocation: false, // 是否处于配置状态
  data_sorce: "", //数据源
  data_range: "all", // 数据范围
  scroll_method: "line", // 滚动方式  line | page
  scroll_time: 2, // 滚动间隔 秒
  pc_line: 10, // PC端显示行数
  phone_line: 3, // 移动端显示行数
  is_line_height: false, // 是否高亮
  line_height_row: "first", // 高亮行  first | appoint
  appoint_line_heights: "", // 指定的高亮行数
  line_hgith_dark_bg: "#1456F0", // 高亮深色背景色
  line_hgith_light_bg: "#E7EEFD", // 高亮浅色背景色
  overflow_ellipsis: false, // 溢出文本滚动
  text_speed: 2, // 文本滚动速度 px/s
  is_zebra: false, // 是否开启斑马纹
  zebra_odd_dark_bg: "#FFFFFF", // 斑马纹 奇数 深色 背景色
  zebra_odd_light_bg: "#F4F5F5", // 斑马纹 奇数 浅色 背景色
  zebra_even_dark_bg: "#FFFFFF", // 斑马纹 偶数 深色 背景色
  zebra_even_light_bg: "#F4F5F5", // 斑马纹 偶数 浅色 背景色
  show_fields: [], // 需要显示的字段
  all_fields: [], // 所有字段
  filters: [],
  filter_text: 'and'
};

export default config;

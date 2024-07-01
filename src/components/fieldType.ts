/**
 * FieldType枚举值
 */
export enum FieldType {
  Text = 1, // 多行文本  string
  Number = 2, // 数字  string
  SingleSelect = 3, // 单选  tag
  MultiSelect = 4, // 多选  tag
  DateTime = 5, // 日期  date
  Checkbox = 7, // 复选框  checkbox
  User = 11, // 人员  string
  Phone = 13, // 电话  string
  Url = 15, // 超链接  string<a/>
  Attachment = 17, // 附件  Attachment
  SingleLink = 18, // 单向关联
  Lookup = 19, // 查找引用
  Formula = 20, // 公式
  DuplexLink = 21, // 双向关联
  Location = 22, // 地理位置  string
  GroupChat = 23, // 群聊  string
  CreatedTime = 1001, // 创建时间  date
  ModifiedTime = 1002, // 修改时间  date
  CreatedUser = 1003, // 创建人  string
  ModifiedUser = 1004, // 修改人  string
  AutoNumber = 1005, // 自动编号  string
  Barcode = 99001, // 二维码  string
  Progress = 99002, // 进度条  string
  Currency = 99003, // 货币  string<货币>
  Rating = 99004, // 评分  rate
  Email = 99005 // 邮箱  string
}
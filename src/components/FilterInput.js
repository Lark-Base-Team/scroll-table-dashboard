import React, {useContext, useEffect, useRef, useState} from "react";
import ConfigContext from "./ConfigContext";
import { numbField, tagColorList, currency } from "../utils/formatter";
import {
  Tag,
  TagGroup,
  Checkbox,
  Image,
  Toast,
  Progress,
  Rating,
  Input,
  DatePicker, Select
} from "@douyinfe/semi-ui"
import moment from "moment";
import "../style/cell.scss"
import {bitable} from "@lark-base-open/js-sdk";
import {cloneDeep} from "@douyinfe/semi-ui/lib/es/_utils";

const FilterInput = (props) => {
  const { data, value, disabled } = props
  const {filterData, setFilterData} = useContext(ConfigContext)

  useEffect(() => {
    // console.log(111111, data)
  }, [data, value])

  const handleInputChange = val => {
    const temp = cloneDeep(filterData)
    setFilterData(Object.assign(temp, {
      value: val
    }))
  }

  const handleDateChange = (date) => {
    const res = date.map(d => Date.parse(d))
    handleInputChange(res)
  }

  const renderByType = type => {
    switch (type) {
      case 1: // 多行文本  string
      case 99001: // 二维码  string
      case 99005: // 邮箱  string
      case 2: // 数字  string
        return <Input disabled={disabled} value={value} onChange={(e) => handleInputChange(e.target.checked)}/>
      case 3: // 单选  tag
      case 4: // 多选  tag
        return ''
      case 5: // 日期  date
      case 1001: // 创建时间  date
      case 1002: // 修改时间  date
        const filterList = [
          {label: '今天', value: 1},
          {label: '明天', value: 2},
          {label: '昨天', value: 3},
          {label: '本周', value: 4},
          {label: '上周', value: 5},
          {label: '本月', value: 6},
          {label: '上月', value: 7},
          {label: '过去7天内', value: 8},
          {label: '未来7天内', value: 9},
          {label: '过去30天内', value: 10},
          {label: '未来30天内', value: 11}
        ]
        return (
          <Select
            filter
            disabled={disabled}
            value={value}
            onChange={(e) => handleInputChange(e)}
            optionList={filterList}
          >
          </Select>
        )
        // return <DatePicker disabled={disabled} type="dateRange" value={value} onChange={(date, dateString) => handleDateChange(date)} />;
      case 7: // 复选框  checkbox
        return <Checkbox disabled={disabled} checked={!!value} onChange={(e) => handleInputChange(e.target.checked)} />
      case 11: // 人员  string
      case 1003: // 创建人  string
      case 1004: // 修改人  string
      case 13: // 电话  string
      case 15: // 超链接  string<a/>
      case 17: // 附件  Attachment
      case 18: // 单向关联
      case 19: // 查找引用
      case 20: // 公式
      case 21: // 双向关联
      case 22: // 地理位置  string
      case 23: // 群聊  string
      case 1005: // 自动编号  string
      case 99002: // 进度条  string
      case 99003: // 货币  string<货币>
      case 99004: // 评分  rate
        return ''
    }
  }

  return (
    /*<div className="width-full" ref={cellRef}>
      <p className="inline-block" ref={textRef} style={{width: 'fit-content'}}>
        {renderText}
      </p>
      {deepConfig.overflow_ellipsis && scrollFlag
        && (
          <p className="inline-block pl-10" style={{width: 'fit-content'}}>
            {renderText}
          </p>
        )}
    </div>*/
    <>
      { renderByType(data.type) }
    </>
  )
}

export default FilterInput
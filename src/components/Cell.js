import {useContext, useEffect, useRef, useState} from "react";
import ConfigContext from "./ConfigContext";
import { numbField, tagColorList, currency } from "../utils/formatter";
import {
  Tag,
  TagGroup,
  Checkbox,
  Image,
  Toast,
  Progress,
  Rating
} from "@douyinfe/semi-ui"
import moment from "moment";
import "../style/cell.scss"
import {bitable} from "@lark-base-open/js-sdk";

const Cell = (props) => {
  const { col, row, index, text } = props
  const {tableComponent, setTableComponent, appHeight, deepConfig} = useContext(ConfigContext)
  const [renderText, setRenderText] = useState('')
  const [scrollFlag, setScrollFlag] = useState(false)
  const cellRef = useRef()
  const textRef = useRef()
  const timer = useRef()

  useEffect(() => {
    getElementByType(col, text, col.type)
  }, [tableComponent]);

  useEffect(() => {
    clearInterval(timer.current)
    return setTextScroll()
  }, [renderText, appHeight]);

  const renderTagList = async () => {
    const list = text?.split('，')
    const tagList = await Promise.all(list.map(async (d, i) => {
      const colorIdx = col.property?.options?.find(item => item.name === d)?.color
      const selectOptColorInfo = await bitable.ui.getSelectOptionColorInfoList();
      const bgColor = selectOptColorInfo?.find(item => item.id === colorIdx)?.bgColor
      const color = selectOptColorInfo?.find(item => item.id === colorIdx)?.textColor
      return {
        children: d,
        style: {
          backgroundColor: bgColor,
          color: color
        }
      }
    }))


    setRenderText(
      (
        <TagGroup
          maxTagCount={1}
          tagList={tagList}
          size="small"
          avatarShape="circle"
          style={{
            width: "80%",
          }}
        />
      )
    )
  }

  const getElementByType = async (col, text, type) => {
    switch (type) {
      case 1: // 多行文本  string
      case 99001: // 二维码  string
      case 99005: // 邮箱  string
        return setRenderText(text || '')
      case 2: // 数字  string
        try {
          const lookupFieldId = col.property?.refFieldId
          const quoteTableId = col.property?.refTableId
          const table = quoteTableId ? await bitable.base.getTable(quoteTableId) : tableComponent
          const numberField = await table.getField(lookupFieldId || col.id)
          const numberFormatter = await numberField.getFormatter()
          return (text || text === 0) && setRenderText(numbField(numberFormatter, text))
        } catch (e) {
          return setRenderText('')
        }
      case 3: // 单选  tag
        const colorIdx = col.property?.options?.find(d => d.name === text)?.color
        const selectOptColorInfo = await bitable.ui.getSelectOptionColorInfoList();
        const bgColor = selectOptColorInfo?.find(d => d.id === colorIdx)?.bgColor
        const color = selectOptColorInfo?.find(d => d.id === colorIdx)?.textColor
        return text && typeof text === 'string' && setRenderText(
          (
            <Tag size="small" shape="circle" style={{backgroundColor: bgColor, color}}>{text}</Tag>
          )
        )
      case 4: // 多选  tag
        return text && await renderTagList()
      case 5: // 日期  date
      case 1001: // 创建时间  date
      case 1002: // 修改时间  date
        try {
          const lookupFieldId = col.property?.refFieldId
          const quoteTableId = col.property?.refTableId
          const table = quoteTableId ? await bitable.base.getTable(quoteTableId) : tableComponent
          const dateField = await table.getField(lookupFieldId || col.id)
          const dateFormatter = await dateField.getDateFormat()
          if (!text) {
            throw ''
          }
          return setRenderText(moment(Number(text)).format(dateFormatter.replaceAll('d', 'D')))
        } catch (e) {
          return setRenderText('')
        }
      case 7: // 复选框  checkbox
        const list = typeof text === 'string' ? text?.split('，').map(d => JSON.parse(d)) : [text]
        // console.log('checked: ', list)
        const domList = list.map?.(d =>  <Checkbox style={{display: 'inline'}} checked={d}/>)
        return setRenderText(
            domList
        )
      case 11: // 人员  string
      case 1003: // 创建人  string
      case 1004: // 修改人  string
        // console.log('人员:', type, text)
        const str = text?.map?.(d => d?.name).join('，')
        return setRenderText(str)
      case 13: // 电话  string
        return setRenderText(text)
      case 15: // 超链接  string<a/>
        return setRenderText(
          (
            <a href={'//'+text} target="_blank">{text}</a>
          )
        )
      case 17: // 附件  Attachment
        try {
          const lookupFieldId = col.property?.refFieldId
          const quoteTableId = col.property?.refTableId
          const table = quoteTableId ? await bitable.base.getTable(quoteTableId) : tableComponent

          const tokenList = text?.map(d => d.token)
          let url
          if (tokenList && tokenList.length) {
            url = await table.getCellAttachmentUrls(tokenList, lookupFieldId || col.id, row.recordId)
          }
          if (url && url.length) {
            return setRenderText(
              url.map(d => {
                return (
                  <Image src={d}/>
                )
              })
            )
          }
        } catch (e) {
          // Toast.error("服务端获取附件数据出错");
          return setRenderText('')
        }
      case 18: // 单向关联
        try {
          const singleResult = typeof text === "object" ? text.text : text
          return setRenderText(singleResult)
        } catch (e) {
          return setRenderText('')
        }
      case 19: // 查找引用
        try {
          const lookupFieldId = col.property?.refFieldId
          const quoteTableId = col.property?.refTableId
          const table = quoteTableId ? await bitable.base.getTable(quoteTableId) : tableComponent
          const lookupField = await table.getField(lookupFieldId)
          const cellType = await lookupField.getType()
          return getElementByType(col, text, cellType)
        } catch (e) {
          return setRenderText('')
        }
      case 20: // 公式
        // const formulaField = await tableComponent.getField(col.id)
        // const value = await  formulaField.getValue(row.recordId)
        const formulaStr = typeof text === 'string'
          ? text
          : text?.map(d => {
            return typeof d === 'string' || typeof d === 'number' ? d : d?.name
          }).join('，')
        return setRenderText(formulaStr)
      case 21: // 双向关联
        try {
          const doubleResult = typeof text === "object" ? text.text : text
          return setRenderText(doubleResult)
        } catch (e) {
          return setRenderText('')
        }
      case 22: // 地理位置  string
        return text && setRenderText(text.fullAddress)
      case 23: // 群聊  string
        try {
          const group = text?.map(d => d?.name).join('，')
          return setRenderText(group)
        } catch (e) {
          return setRenderText()
        }
      case 1005: // 自动编号  string
        return text && setRenderText(text.value)
      case 99002: // 进度条  string
        try {
          const progressField = await tableComponent.getField(col.id)
          const value = await progressField.getValue(row.recordId)
          return text && setRenderText((
            <Progress percent={text*100} showInfo={true} />
          ))
        } catch (e) {
          return setRenderText('')
        }
      case 99003: // 货币  string<货币>
        try {
          const currencyField = await tableComponent.getField(col.id);
          const currencyFormat = await currencyField.getCurrencyCode()
          const digits = await currencyField.getDecimalDigits()
          const value = await currencyField.getValue(row.recordId)
          return (value || value === 0) && setRenderText(`${currency[currencyFormat]}${value.toFixed(digits)}`)
        } catch (e) {
          return setRenderText('')
        }
      case 99004: // 评分  rate
        return text && setRenderText((
          <Rating
            disabled
            defaultValue={text}
            size={"small"}
          />
        ))
    }
  }

  const setTextScroll = () => {
    if (deepConfig.overflow_ellipsis) {
      const cellWidth = cellRef.current.clientWidth
      const textWidth = textRef.current.clientWidth
      if (textWidth > cellWidth) {
        setScrollFlag(true)
        const speed = deepConfig.text_speed
        const timeout = 1000 / speed
        let i = 0
        timer.current = setInterval(() => {
          if (cellRef.current) {
            cellRef.current.style.transform = `translateX(${i--}px)`
          }
          if (Math.abs(i) >= textWidth + 10) {
            i = 0
          }
        }, timeout)
      } else {
        setScrollFlag(false)
        cellRef.current.style.transform = '0px'
      }
    }
  }

  return (
    <div className="width-full" ref={cellRef}>
      <p className="inline-flex" ref={textRef} style={{width: 'fit-content'}}>
        {renderText}
      </p>
      {deepConfig.overflow_ellipsis && scrollFlag
        && (
          <p className="inline-block pl-10" style={{width: 'fit-content'}}>
            {renderText}
          </p>
        )}
    </div>
  )
}

export default Cell
import React, {useRef, useState, useEffect, forwardRef, useContext} from "react";
import {Table, Toast} from "@douyinfe/semi-ui";
import {
  getSize,
  getDatas,
  commonInfo,
  initColumns, getDataSource,
} from "./const";
import ConfigContext from "./ConfigContext";
import {bitable, dashboard} from "@lark-base-open/js-sdk";
import Cell from "./Cell";
import {cloneDeep} from "@douyinfe/semi-ui/lib/es/_utils";
import {line_computed, my_plat, scroll_computed, show_columns} from "../utils/computed";

let scrollTimer = null

const VirtualizedFixedDemo = forwardRef((props, ref) => {
  const {deepConfig, setDeepConfig, appHeight, dataRange, setDataRange, mainTheme} = useContext(ConfigContext)
  let virtualizedListRef = useRef();
  const scrollPanel = useRef()
  const [scroll, setScroll] = useState({});
  const [virtualized, setVirtualized] = useState({});
  const [tableDatas, setTableDatas] = useState([]);
  const [tableComponent, setTableComponent] = useState()

  // commonInfo.virtualizedListRef = virtualizedListRef;
  commonInfo.deepConfig = deepConfig;

  useEffect(() => {
    if (deepConfig.data_sorce) {
      getTableDataById(deepConfig.data_sorce)
    }

    document.getElementById('scroll-table-container').addEventListener('wheel', function(event) {
      event.preventDefault();
    }, { passive: false });
  }, []);

  useEffect(() => {
    if (deepConfig.data_sorce) {
      getTableDataById(deepConfig.data_sorce)
    }
  }, [deepConfig, deepConfig.data_sorce, dataRange])

  useEffect(() => {
    resizeByHeight()
  }, [appHeight]);

  const resizeByHeight = () => {
    if (appHeight) {
      getSize(appHeight, tableDatas.length).then((res) => {
        setScroll({ y: res.y, x: res.x });
        setVirtualized({
          itemSize: res.itemSize,
        });
        const tbody = document.querySelectorAll('.semi-table-tbody')
        if (tbody && tbody.length) {
          tbody.forEach((d, i) => {
            d.querySelectorAll('.semi-table-row').forEach((ele, i) => {
              ele.style.setProperty('height', `${res.itemSize}px`)
              ele.style.setProperty('top', `${i * res.itemSize }px`)
            })
          })
        }
        initScroll(res.itemSize)
      });
    }
  }

  const resizeByRow = (tableLength) => {
    if (appHeight) {
      getSize(appHeight, tableLength).then((res) => {
        setScroll({ y: res.y, x: res.x });
        setVirtualized({
          itemSize: res.itemSize,
        });
        const tbody = document.querySelectorAll('.semi-table-tbody')
        if (tbody && tbody.length) {
          tbody.forEach((d, i) => {
            d.querySelectorAll('.semi-table-row').forEach((ele, i) => {
              ele.style.setProperty('height', `${res.itemSize}px`)
              ele.style.setProperty('top', `${i * res.itemSize }px`)
            })
          })
        }
        initScroll(res.itemSize, tableLength)
      });
    }
  }

  const getLineComputed = () => { // 根据设备获取行数
    return my_plat(deepConfig) === 'pc'
      ? deepConfig.pc_line
      : deepConfig.phone_line
    // return deepConfig.my_plat() === 'pc'
    //   ? deepConfig.pc_line
    //   : deepConfig.phone_line
  }

  const getColumns = () => { // 获取列数据
    return show_columns(deepConfig).map(d => {
      return {
        title: d?.name,
        dataIndex: d?.id,
        type: d?.type,
        render: (text, row, index) => {
          return (
            <ConfigContext.Provider value={{tableComponent, setTableComponent, appHeight, deepConfig}}>
              <Cell
                col={d}
                row={row}
                index={index}
                text={text}
                table={tableComponent}
              />
            </ConfigContext.Provider>
          )
        }
      }
    })
  }

  const getTableDataById = async id => { // 根据id获取列表数据
    const table = await bitable.base.getTable(id)
    setTableComponent(table)
    getDatas(table).then(res => {
      const length = getLineComputed()
      let result = new Array(length).fill(0)
      let scrollFlag = false
      if (res.length < length) {
        result = result.map((d, i) => {
          return res[i % res.length]
        })
      } else {
        scrollFlag = true
        result = res
        // result.length = length
      }
      result = result.map((d, i) => {
        return Object.assign(cloneDeep(d), {
          key: Math.random()
        })
      })
      setTableDatas(result)
      if (scrollFlag) {
        // initScroll();
      }
      resizeByRow(result.length)
    })
  }

  const handleRow = (row, index) => {
    if (deepConfig.is_line_height && deepConfig.is_zebra) { // 设置高亮并且设置斑马纹 高亮优先级高于斑马纹
      if (deepConfig.line_height_row === 'first') {
        if (mainTheme === 'DARK') {
          return index === 0
            ? {
              style: {
                background: deepConfig.line_hgith_dark_bg
              }
            }
            : {
              style: {
                background: index % 2 === 0
                  ? deepConfig.zebra_odd_dark_bg
                  : deepConfig.zebra_even_dark_bg
              }
            }
        } else {
          return index === 0
            ? {
              style: {
                background: deepConfig.line_hgith_light_bg
              }
            }
            : {
              style: {
                background: index % 2 === 0
                  ? deepConfig.zebra_odd_light_bg
                  : deepConfig.zebra_even_light_bg
              }
            }
        }
      } else {
        let lineList = deepConfig.appoint_line_heights
          .replaceAll('，', ',')
          .split(',')
        const formatErr = lineList.some(d => isNaN(d))
        if (formatErr) {
          return {}
        } else {
          lineList = lineList.map(d => Number(d))
        }
        if (mainTheme === 'DARK') {
          if (lineList.includes(index + 1)) {
            return {
              style: {
                background: deepConfig.line_hgith_dark_bg
              }
            }
          } else {
            return {
              style: {
                background: index % 2 === 0
                  ? deepConfig.zebra_odd_dark_bg
                  : deepConfig.zebra_even_dark_bg
              }
            }
          }
        } else {
          if (lineList.includes(index + 1)) {
            return {
              style: {
                background: deepConfig.line_hgith_light_bg
              }
            }
          } else {
            return {
              style: {
                background: index % 2 === 0
                  ? deepConfig.zebra_odd_light_bg
                  : deepConfig.zebra_even_light_bg
              }
            }
          }
        }
      }
    } else if (deepConfig.is_line_height && !deepConfig.is_zebra) { // 只设置高亮
      if (deepConfig.line_height_row === 'first') { //首行高亮
        if (mainTheme === 'DARK') {
          return index === 0
            ? {
              style: {
                background: deepConfig.line_hgith_dark_bg
              }
            }
            : {}
        } else {
          return index === 0
            ? {
              style: {
                background: deepConfig.line_hgith_light_bg
              }
            }
            : {}
        }
      } else {
        let lineList = deepConfig.appoint_line_heights
          .replaceAll('，', ',')
          .split(',')
        const formatErr = lineList.some(d => isNaN(d))
        if (formatErr) {
          return {}
        } else {
          lineList = lineList.map(d => Number(d))
        }
        if (mainTheme === 'DARK') {
          if (lineList.includes(index + 1)) {
            return {
              style: {
                background: deepConfig.line_hgith_dark_bg
              }
            }
          } else {
            return {}
          }
        } else {
          if (lineList.includes(index + 1)) {
            return {
              style: {
                background: deepConfig.line_hgith_light_bg
              }
            }
          } else {
            return {
              style: {
                background: index % 2 === 0
                  ? deepConfig.zebra_odd_light_bg
                  : deepConfig.zebra_even_light_bg
              }
            }
          }
        }
      }
    } else if (!deepConfig.is_line_height && deepConfig.is_zebra) { // 只设置斑马纹
      if (mainTheme === 'DARK') {
        return {
          style: {
            background: index % 2 === 0
              ? deepConfig.zebra_odd_dark_bg
              : deepConfig.zebra_even_dark_bg
          }
        }
      } else {
        return {
          style: {
            background: index % 2 === 0
              ? deepConfig.zebra_odd_light_bg
              : deepConfig.zebra_even_light_bg
          }
        }
      }
    } else { //都不设置
      return {}
    }
  }

  let rowIndex = 0
  const initScroll = (rowHeight, tableLength) => {
    clearInterval(scrollTimer)
    scrollTimer = null
    rowIndex = 0
    scrollPanel.current.scrollTop = rowIndex * rowHeight

    if (deepConfig.scroll_method === 'line') {
      const length = tableLength || tableDatas.length
      if (!scrollTimer) {
        scrollTimer = setInterval(() => {
          if (rowIndex >= length) {
            rowIndex = 0
            scrollPanel.current.style.scrollBehavior = ''
            scrollPanel.current.scrollTop = rowIndex * rowHeight
            rowIndex ++
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          } else {
            rowIndex ++
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          }
        }, deepConfig.scroll_time * 1000)
      }
    } else {
      const length = tableLength || tableDatas.length
      if (!scrollTimer) {
        scrollTimer = setInterval(() => {
          if (rowIndex >= length) {
            rowIndex = 0
            scrollPanel.current.style.scrollBehavior = ''
            scrollPanel.current.scrollTop = rowIndex * rowHeight
            rowIndex += line_computed(commonInfo.deepConfig)
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          } else if (length - rowIndex <= line_computed(commonInfo.deepConfig)) {
            rowIndex += length - rowIndex
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          } else {
            rowIndex += line_computed(commonInfo.deepConfig)
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          }
        }, deepConfig.scroll_time * 1000)
      }
    }
  }

  return (
    <div id="scroll-table-container">
      <Table
        id="scroll-table-header"
        style={{whiteSpace: "nowrap", textOverflow: "ellipsis" }}
        virtualized={virtualized}
        resizable={deepConfig.is_allocation}
        pagination={false}
        columns={getColumns()}
        dataSource={tableDatas}
        scroll={scroll}
        onRow={handleRow}
        getVirtualizedListRef={(ref) => (virtualizedListRef = ref)}
      />
      <div className="scroll-panel" ref={scrollPanel}>
        <Table
          id="scroll-table-body"
          virtualized={virtualized}
          resizable={deepConfig.is_allocation}
          pagination={false}
          columns={getColumns()}
          dataSource={tableDatas}
          scroll={scroll}
          onRow={handleRow}
          getVirtualizedListRef={(ref) => (virtualizedListRef = ref)}
        />
        <Table
          id="scroll-table-body-copy"
          virtualized={virtualized}
          resizable={deepConfig.is_allocation}
          pagination={false}
          columns={getColumns()}
          dataSource={tableDatas}
          scroll={scroll}
          onRow={handleRow}
          getVirtualizedListRef={(ref) => (virtualizedListRef = ref)}
        />
      </div>
    </div>
  );
})

export default VirtualizedFixedDemo

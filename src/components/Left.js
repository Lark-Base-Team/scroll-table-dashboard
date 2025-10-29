import React, { useRef, useState, useEffect, forwardRef, useContext, useLayoutEffect } from "react";
import { Table, Toast } from "@douyinfe/semi-ui";
import {
  getSize,
  getDatas,
  commonInfo,
  initColumns, getDataSource,
} from "./const";
import ConfigContext from "./ConfigContext";
import { bitable, dashboard } from "@lark-base-open/js-sdk";
import Cell from "./Cell";
import { cloneDeep } from "@douyinfe/semi-ui/lib/es/_utils";
import { line_computed, my_plat, scroll_computed, show_columns } from "../utils/computed";
// import { includesFilter, notIncludesFilter, dateInFilter } from '../utils/filter'

let scrollTimer = null

const VirtualizedFixedDemo = forwardRef((props, ref) => {
  const ctx = useContext(ConfigContext)
  const { deepConfig, formConfig, appHeight, dataRange, setDataRange, mainTheme, currentTheme } = ctx
  let virtualizedListRef = useRef();
  const scrollPanel = useRef()
  const [scroll, setScroll] = useState({});
  const [virtualized, setVirtualized] = useState({});
  const [itemSize, setItemSize] = useState();

  /** 渲染用的全部数据
   * {
   * key: recordId,
   * index: 从1开始的索引
   * }[]
   */
  const [tableDatas, setTableDatas] = useState([]);

  console.log('===tableDatas', tableDatas);
  const [tableComponent, setTableComponent] = useState();

  /** 当前源数据表信息 */
  const [dataInfo, setDataInfo] = useState({
    /** table实例 */
    table: {},
    tableId: '',
    /** viewId */
    viewId: '',
  });


  /** 最新的一页信息 */
  const [currentPageData, setCurrentPageData] = useState({
    records: [],
    hasMore: true,
    total: 99999,
    pageToken: undefined,
  });

  console.log('===props', props)
  /** 源数据表变化，重置数据 */
  useEffect(() => {
    const tableId = formConfig.data_sorce;
    const viewId = formConfig.data_range;
    async function update() {
      if (!tableId || !viewId) {
        return;
      }
      const table = await bitable.base.getTableById(tableId);
      setDataInfo({
        table,
        tableId,
        viewId,
      });
      setTableDatas([]);
      const records = await table.getRecordsByPage({
        viewId,
        // stringValue:true,
      });

      setCurrentPageData(records);
    }
    update();
  }, [formConfig.data_sorce, formConfig.data_range]);

  useLayoutEffect(() => {
    const records = currentPageData.records;
    const newData = records.map((r, _index) => {
      const index = tableDatas.length + _index + 1;
      return {
        key: r.recordId,
        ...r.fields,
        index,
      }
    });

    setTableDatas(tableDatas.concat(newData));
  }, [currentPageData])




  // commonInfo.virtualizedListRef = virtualizedListRef;
  // commonInfo.deepConfig = deepConfig;

  useEffect(() => {
    if (formConfig.data_sorce) {
      getTableDataById(formConfig.data_sorce)
    }

    document.getElementById('scroll-table-container').addEventListener('wheel', function (event) {
      event.preventDefault();
    }, { passive: false });
  }, []);

  useEffect(() => {
    if (formConfig.data_sorce) {
      getTableDataById(formConfig.data_sorce)
    }
  }, [formConfig, formConfig.data_sorce, dataRange])

  useEffect(() => {
    resizeByHeight()
  }, [appHeight]);

  const resizeByHeight = () => {
    if (appHeight) {
      getSize(appHeight, tableDatas.length, formConfig).then((res) => {
        setScroll({ y: res.y, x: res.x });
        setItemSize(res.itemSize);
        const tbody = document.querySelectorAll('.semi-table-tbody')
        if (tbody && tbody.length) {
          tbody.forEach((d, i) => {
            d.querySelectorAll('.semi-table-row').forEach((ele, i) => {
              ele.style.setProperty('height', `${res.itemSize}px`)
              ele.style.setProperty('top', `${i * res.itemSize}px`)
            })
          })
        }
        initScroll(res.itemSize)
      });
    }
  }

  const resizeByRow = (tableLength) => {
    if (appHeight) {
      getSize(appHeight, tableLength, formConfig).then((res) => {
        setScroll({ y: res.y, x: res.x });
        setItemSize(res.itemSize);
        const tbody = document.querySelectorAll('.semi-table-tbody')
        if (tbody && tbody.length) {
          tbody.forEach((d, i) => {
            d.querySelectorAll('.semi-table-row').forEach((ele, i) => {
              ele.style.setProperty('height', `${res.itemSize}px`)
              ele.style.setProperty('top', `${i * res.itemSize}px`)
            })
          })
        }
        initScroll(res.itemSize, tableLength)
      });
    }
  }

  const getLineComputed = () => { // 根据设备获取行数
    return my_plat() === 'pc'
      ? formConfig.pc_line
      : formConfig.phone_line
    // return deepConfig.my_plat() === 'pc'
    //   ? formConfig.pc_line
    //   : formConfig.phone_line
  }

  const getColumns = () => { // 获取列数据
    return show_columns(formConfig).map(d => {

      return {
        title: d?.name,
        dataIndex: d?.id,
        type: d?.type,
        render: (text, row, index) => {
          // TODO 这里设置斑马条纹之类的
          return (
            <ConfigContext.Provider value={{ tableComponent, setTableComponent, appHeight, deepConfig, formConfig }}>
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
    return;
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
        return Object.assign(cloneDeep(d ?? {}), {
          key: Math.random()
        })
      })
      /*if (deepConfig.filters.length) {
        result = result.filter(d => {
          const tempList = []
          deepConfig.filters.map(item => {
            const filterConditionMap = {
              'incl': includesFilter,
              'notIncl': notIncludesFilter,
              'eq': dateInFilter
            }
            const filterFunc = filterConditionMap[item.condition] //item.condition === 'incl' ? includesFilter : notIncludesFilter
            const value = typeof d[item.column.id] == 'string' ? d[item.column.id].split('，').map(x => JSON.parse(x)) : d[item.column.id]
            tempList.push(filterFunc(value, item.value || false))
          })
          console.log(1111111222 ,tempList.length)
          return deepConfig.filter_text === 'and' ? tempList.every(flag => flag) : tempList.some(flag => flag)
        })
      }*/
      // console.log(111111, result)
      setTableDatas(result)
      if (scrollFlag) {
        // initScroll();
      }
      resizeByRow(result.length)
    })
  }

  const handleRow = (row, index) => {
    if (formConfig.is_line_height && formConfig.is_zebra) { // 设置高亮并且设置斑马纹 高亮优先级高于斑马纹
      if (formConfig.line_height_row === 'first') {
        if (currentTheme?.theme === 'DARK') {
          return index === 0
            ? {
              style: {
                background: formConfig.line_hgith_dark_bg
              }
            }
            : {
              style: {
                background: index % 2 === 0
                  ? formConfig.zebra_odd_dark_bg
                  : formConfig.zebra_even_dark_bg
              }
            }
        } else {
          return index === 0
            ? {
              style: {
                background: formConfig.line_hgith_light_bg
              }
            }
            : {
              style: {
                background: index % 2 === 0
                  ? formConfig.zebra_odd_light_bg
                  : formConfig.zebra_even_light_bg
              }
            }
        }
      } else {
        let lineList = formConfig.appoint_line_heights
          .replaceAll('，', ',')
          .split(',')
        const formatErr = lineList.some(d => isNaN(d))
        if (formatErr) {
          return {}
        } else {
          lineList = lineList.map(d => Number(d))
        }
        if (currentTheme?.theme === 'DARK') {
          if (lineList.includes(index + 1)) {
            return {
              style: {
                background: formConfig.line_hgith_dark_bg
              }
            }
          } else {
            return {
              style: {
                background: index % 2 === 0
                  ? formConfig.zebra_odd_dark_bg
                  : formConfig.zebra_even_dark_bg
              }
            }
          }
        } else {
          if (lineList.includes(index + 1)) {
            return {
              style: {
                background: formConfig.line_hgith_light_bg
              }
            }
          } else {
            return {
              style: {
                background: index % 2 === 0
                  ? formConfig.zebra_odd_light_bg
                  : formConfig.zebra_even_light_bg
              }
            }
          }
        }
      }
    } else if (formConfig.is_line_height && !formConfig.is_zebra) { // 只设置高亮
      if (formConfig.line_height_row === 'first') { //首行高亮
        if (currentTheme?.theme === 'DARK') {
          return index === 0
            ? {
              style: {
                background: formConfig.line_hgith_dark_bg
              }
            }
            : {
              style: {
                background: currentTheme?.chartBgColor
              }
            }
        } else {
          return index === 0
            ? {
              style: {
                background: formConfig.line_hgith_light_bg
              }
            }
            : {
              style: {
                background: currentTheme?.chartBgColor
              }
            }
        }
      } else {
        let lineList = formConfig.appoint_line_heights
          .replaceAll('，', ',')
          .split(',')
        const formatErr = lineList.some(d => isNaN(d))
        if (formatErr) {
          return {
            style: {
              background: currentTheme?.chartBgColor
            }
          }
        } else {
          lineList = lineList.map(d => Number(d))
        }
        if (currentTheme?.theme === 'DARK') {
          if (lineList.includes(index + 1)) {
            return {
              style: {
                background: formConfig.line_hgith_dark_bg
              }
            }
          } else {
            return {
              style: {
                background: currentTheme?.chartBgColor
              }
            }
          }
        } else {
          if (lineList.includes(index + 1)) {
            return {
              style: {
                background: formConfig.line_hgith_light_bg
              }
            }
          } else {
            return {
              style: {
                background: index % 2 === 0
                  ? formConfig.zebra_odd_light_bg
                  : formConfig.zebra_even_light_bg
              }
            }
          }
        }
      }
    } else if (!formConfig.is_line_height && formConfig.is_zebra) { // 只设置斑马纹
      if (currentTheme?.theme === 'DARK') {
        return {
          style: {
            background: index % 2 === 0
              ? formConfig.zebra_odd_dark_bg
              : formConfig.zebra_even_dark_bg
          }
        }
      } else {
        return {
          style: {
            background: index % 2 === 0
              ? formConfig.zebra_odd_light_bg
              : formConfig.zebra_even_light_bg
          }
        }
      }
    } else { //都不设置
      return {
        style: {
          background: currentTheme?.chartBgColor
        }
      }
    }
  }

  let rowIndex = 0
  const initScroll = (rowHeight, tableLength) => {
    debugger;
    return;
    clearInterval(scrollTimer)
    scrollTimer = null
    rowIndex = 0
    scrollPanel.current.scrollTop = rowIndex * rowHeight

    if (formConfig.scroll_method === 'line') {
      const length = tableLength || tableDatas.length
      if (!scrollTimer) {
        scrollTimer = setInterval(() => {
          if (rowIndex >= length) {
            rowIndex = 0
            scrollPanel.current.style.scrollBehavior = ''
            scrollPanel.current.scrollTop = rowIndex * rowHeight
            rowIndex++
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          } else {
            rowIndex++
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          }
        }, formConfig.scroll_time * 1000)
      }
    } else {
      const length = tableLength || tableDatas.length
      if (!scrollTimer) {
        scrollTimer = setInterval(() => {
          if (rowIndex >= length) {
            rowIndex = 0
            scrollPanel.current.style.scrollBehavior = ''
            scrollPanel.current.scrollTop = rowIndex * rowHeight
            rowIndex += line_computed(formConfig)
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          } else if (length - rowIndex <= line_computed(formConfig)) {
            rowIndex += length - rowIndex
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          } else {
            rowIndex += line_computed(formConfig)
            scrollPanel.current.style.scrollBehavior = 'smooth'
            scrollPanel.current.scrollTop = rowIndex * rowHeight
          }
        }, formConfig.scroll_time * 1000)
      }
    }
  }

  /*
  
  // TODO 可以虚拟滚动
[.semi-table-body].scrollBy({
  top: 100,
  behavior: "smooth",
});
  
  */

  async function loadMore() {
    const records = await dataInfo.table.getRecordsByPage({
      viewId: formConfig.data_range,
      // stringValue:true,
      pageToken: currentPageData.pageToken,
    });
    setTableDatas(records);
  }

  return <div id="scroll-table-container">
    <div className="scroll-panel" ref={scrollPanel}>
      <Table
        id="scroll-table-body"
        virtualized={{
          itemSize,
          onScroll: ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
            if (
              scrollDirection === 'forward' &&
              scrollOffset >= (tableDatas.length - Math.ceil(scroll.y / itemSize) * 1.5) * itemSize &&
              !scrollUpdateWasRequested
            ) {
              loadMore();
            }
          },
        }}
        resizable={formConfig.is_allocation}
        pagination={false}
        columns={getColumns()}
        dataSource={tableDatas}
        scroll={scroll}
        onRow={handleRow}
        getVirtualizedListRef={(ref) => (virtualizedListRef = ref)}
      />
      {/* <Table
          id="scroll-table-body-copy"
          virtualized={virtualized}
          resizable={formConfig.is_allocation}
          pagination={false}
          columns={getColumns()}
          dataSource={tableDatas}
          scroll={scroll}
          onRow={handleRow}
          getVirtualizedListRef={(ref) => (virtualizedListRef = ref)}
        /> */}
    </div>
  </div>

  return (
    <div id="scroll-table-container">
      <Table
        id="scroll-table-header"
        style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
        virtualized={virtualized}
        resizable={formConfig.is_allocation}
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
          virtualized={{
            itemSize,
            onScroll: ({ scrollDirection, scrollOffset, scrollUpdateWasRequested }) => {
              if (
                scrollDirection === 'forward' &&
                scrollOffset >= (tableDatas.length - Math.ceil(scroll.y / itemSize) * 1.5) * itemSize &&
                !scrollUpdateWasRequested
              ) {
                loadMore();
              }
            },
          }}
          resizable={formConfig.is_allocation}
          pagination={false}
          columns={getColumns()}
          dataSource={tableDatas}
          scroll={scroll}
          onRow={handleRow}
          getVirtualizedListRef={(ref) => (virtualizedListRef = ref)}
        />
        {/* <Table
          id="scroll-table-body-copy"
          virtualized={virtualized}
          resizable={formConfig.is_allocation}
          pagination={false}
          columns={getColumns()}
          dataSource={tableDatas}
          scroll={scroll}
          onRow={handleRow}
          getVirtualizedListRef={(ref) => (virtualizedListRef = ref)}
        /> */}
      </div>
    </div>
  );
})

export default VirtualizedFixedDemo

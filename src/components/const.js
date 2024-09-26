import { bitable, dashboard } from "@lark-base-open/js-sdk";
import { Toast } from "@douyinfe/semi-ui";
import { line_computed, scroll_computed } from '../utils/computed'
import app from "../App";
import {cloneDeep} from "@douyinfe/semi-ui/lib/es/_utils";
import record from "./config";

let first_range_id = "";
const state = dashboard.state
export const commonInfo = {};
// 获取数据源
export function getDataSource(fetchedConfig = null) {
  return new Promise(async (resolve, reject) => {
    try {
      const { deepConfig, setDeepConfig, formRef } = commonInfo;
      const tableList = await bitable.base.getTableMetaList();
      deepConfig.data_sorce = fetchedConfig
        ? fetchedConfig.data_sorce
        : deepConfig.data_sorce || tableList?.[0]?.id;
      if (state === 'Config' || state === 'Create') {
        setDeepConfig(deepConfig);
        formRef.current.formApi.setValue("data_sorce", deepConfig.data_sorce);
      }
      await changeSource(deepConfig.data_sorce, true);
      resolve(tableList);
    } catch (err) {
      Toast.error("获取数据源失败");
      reject(err);
    }
  });
}

// TODO 处理表头
export function initColumns() {
  // const { deepConfig, setDeepConfig } = commonInfo;
  // deepConfig.show_columns = deepConfig.show_fields.map((item) => {
  //   return {
  //     title: item.name,
  //     type: "text", // 渲染icon
  //     dataIndex: "key",
  //     render: (text, record, index) => {
  //       return <div>{text}</div>;
  //     },
  //   };
  // });
  // console.log(deepConfig.show_columns);
  // setDeepConfig(deepConfig);
  // TODO 测试代码
  return [
    {
      title: "标题",
      type: "text", // 渲染icon
      dataIndex: "key",
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "文本",
      type: "text", // 渲染icon
      dataIndex: "key",
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
  ];
}

const getTableData = async (table, res, params, times = 0) => {
  let result
  return new Promise(async (resolve, reject) => {
    if (res.hasMore) {
      times++;
      const temp = await table.getRecordsByPage({
        pageSize: params.pageSize,
        pageToken: params.pageSize * times,
        viewId: params.viewId
      })
      const recList = await getTableData(table, temp, params, times)
      result = Object.assign(res, {
        records: res.records.concat(recList.records)
      })
    } else {
      result = res
    }
    console.log(111111, result)
    resolve(result)
  })
}

// TODO 获取数据
export function getDatas(table) {
  return new Promise(async (resolve, reject) => {
    const { data_range } = commonInfo.deepConfig;
    const { formRef } = commonInfo
    if (state === 'Config') {
      formRef.current.formApi.setValue("data_range", data_range);
    }
    const pageSize = 200
    const res = await table.getRecordsByPage({
      pageSize,
      viewId: data_range === "all" ? undefined : data_range,
    });

    let recordList = await getTableData(table, res, {
      pageSize,
      viewId: data_range === "all" ? undefined : data_range
    })
    const data = [];
    const list = recordList?.records || [];
    for (let i = 0; i < list.length; i++) {
      const info = { recordId: list[i].recordId };
      const fields = list[i]?.fields;
      Object.keys(fields).forEach((key) => {
        const valueInfo = fields[key];
        if (!valueInfo) return;
        const value =
          valueInfo?.map?.((it) => typeof it === 'object' ? it?.text : it)?.join("，") ||
          valueInfo?.text ||
          valueInfo;
        info[key] = value;
      });
      if (Object.keys(info).length > 1) {
        data.push(info);
      }
    }
    resolve(data);
  });
}

// 处理滚动
let scrollTimer;
export function initScroll() {
  const { virtualizedListRef } = commonInfo;
  const { scroll_time } = commonInfo.deepConfig;
  let scrollIndex = 0;
  clearInterval(scrollTimer);
  scrollTimer = setInterval(() => {
    scrollIndex += scroll_computed(commonInfo.deepConfig);
    virtualizedListRef.current?.scrollToItem(scrollIndex, "start");
  }, scroll_time * 1000);
}

// 拿到尺寸
export function getSize(appHeight, rowLength = 1) {
  return new Promise((resolve) => {
    const state = dashboard.state
    setTimeout(() => {
      const baseHeight = appHeight - 40
      const itemSize = state === 'Create' || state === 'Config'
        ? baseHeight / line_computed(commonInfo.deepConfig)
        : (baseHeight / line_computed(commonInfo.deepConfig))
      const tbody = document.querySelector('.semi-table-tbody')
      resolve({
        x: "100%",
        y: itemSize * rowLength,
        itemSize,
      });
    }, 0);
  });
}

// 数据源改变，获取数据范围
export async function changeSource(value, firstLoadFlag = false) {
  return new Promise(async (resolve, reject) => {
    const { deepConfig, setDeepConfig, formRef, setDataRange } = commonInfo;
    deepConfig.data_sorce = value;
    if (state === 'Create') {
      formRef.current.formApi.setValue("data_range", "all");
    }

    if (state === 'Config' || state === 'Create') {
      setDataRange([]);
      setDeepConfig(deepConfig);
    }
    if (!value) return;
    try {
      const table = await bitable.base.getTable(value);
      const tables = await table.getViewMetaList();
      first_range_id = tables[0].id;
      if (state === 'Config' || state === 'Create') {
        setDataRange(tables);
      }
      await getAllFields("all", firstLoadFlag);
      resolve()
    } catch (err) {
      Toast.error("获取数据范围失败");
      reject()
      console.log(err);
    }
  })
}

// 重新拉取所有字段
export async function getAllFields(value, firstLoadFlag = false) {
  return new Promise(async (resolve, reject) => {
    const { deepConfig, setDeepConfig } = commonInfo;
    deepConfig.data_range = value;
    if (state === 'Config' || state === 'Create') {
      setDeepConfig(deepConfig);
    }
    const { data_sorce, data_range } = deepConfig;
    if (!data_sorce || !data_range) return;
    if (state === 'Create' || (state === 'Config' && !firstLoadFlag)) {
      const table = await bitable.base.getTable(data_sorce);
      const view = await table.getViewById(first_range_id);
      deepConfig.all_fields = await view.getFieldMetaList();
      deepConfig.show_fields.length = 0;
      const len = deepConfig.all_fields.length <= 5 ? deepConfig.all_fields.length : 5
      for (let i = 0; i < len; i++) {
        const item = deepConfig.all_fields?.[i];
        if (item) {
          try {
            addField(item.id);
          } catch (e) {
            console.log('err:', e);
          }
        }
      }
    }
    if (state === 'Config' || state === 'Create') {
      setDeepConfig(deepConfig);
    }
    // getDatas(table);
    // initColumns();
    resolve()
  })
}

// 添加字段
export function addField(id) {
  const { deepConfig, setDeepConfig } = commonInfo;
  const { all_fields, show_fields } = deepConfig;
  const temp = cloneDeep(show_fields)
  temp.push(
    JSON.parse(JSON.stringify(all_fields?.find((item) => item.id === id)))
  );
  // deepConfig.show_fields = cloneDeep(temp)
  if (state === 'Config' || state === 'Create') {
    setDeepConfig(Object.assign(deepConfig, {
      show_fields: temp
    }));
  }
  // initColumns();
}

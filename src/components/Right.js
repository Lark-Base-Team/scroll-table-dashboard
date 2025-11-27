import React, { useEffect, useState, useRef, forwardRef, useContext } from "react";
import {
  Select,
  Form,
  Button,
  InputNumber,
  Switch,
  Input, Toast,
  Tooltip,
} from "@douyinfe/semi-ui";
import {
  changeSource,
  getAllFields,
  addField,
  commonInfo,
} from "./const";
import {
  IconMark,
  IconEyeOpened,
  IconEyeClosed,
  IconDelete,
  IconPlus,
} from "@douyinfe/semi-icons";
import { dashboard as sdkDashboard } from "@lark-base-open/js-sdk";
import { cloneDeep } from "@douyinfe/semi-ui/lib/es/_utils";
import ConfigContext from "./ConfigContext";
import '../style/right.scss'
import { Banner } from '@douyinfe/semi-ui';
import { BaseSelector } from "./BaseSelector";

const App = forwardRef((props, ref) => {
  const { deepConfig, setDeepConfig } = useContext(ConfigContext)
  const { dataSource, allFields, bitableContext, setRenderLoading } = props; // 全局配置
  const formRef = useRef(); // form组件
  const [dataRange, setDataRange] = useState([]); // 数据范围下拉
  const [allField, setAllField] = useState([]); // 选择字段下拉
  const [showAddField, setShowAddField] = useState(false); //设置添加字段下拉框
  const [showAddFilter, setShowAddFilter] = useState(false); //设置添加筛选条件下拉
  const [filterList, setFilterList] = useState([]) // 筛选条件列表
  const [filterData, setFilterData] = useState({}) // 新增筛选条件对象
  
  commonInfo.deepConfig = deepConfig;
  commonInfo.setDeepConfig = setDeepConfig;
  commonInfo.formRef = formRef;
  commonInfo.setDataRange = setDataRange;
  const {
    bitable,
    baseToken,
    changeBase
  } = bitableContext ?? {};
  const dashboard = bitable?.dashboard;

  const filterCondition = [
    {
      value: 'eq',
      label: '等于',
      type: [5, 1001, 1002]
    },
    // {
    //   value: 'notEq',
    //   label: '不等于'
    // },
    {
      value: 'incl',
      label: '包含',
      type: [7]
    },
    {
      value: 'notIncl',
      label: '不包含',
      type: [7]
    },
    // {
    //   value: 'in',
    //   label: '属于',
    //   type: [5, 1001, 1002]
    // }
    // {
    //   value: 'empt',
    //   label: '为空'
    // },
    // {
    //   value: 'notEmpt',
    //   label: '不为空'
    // }
  ]

  // 修改base
  const onChangeBase = async (token) => {
    try {
      setRenderLoading(true)
      const bitable = await changeBase(token);
      deepConfig.baseToken = token;
      await changeSource(bitable);
    } catch (e) {
      console.error(e)
    } finally {
      setRenderLoading(false)
    }
  }
  
  // 修改数据源
  const onChangeSource = async (value) => {
    try {
      setRenderLoading(true)
      await changeSource(bitable, value);
      const temp = cloneDeep(deepConfig)
      setDeepConfig(temp)
    } catch (e) {
      console.error(e)
    } finally {
      setRenderLoading(false)
    }
  }

  // 修改数据范围
  const onChangeRange = async (value) => {
    await getAllFields(bitable, value);
    const temp = cloneDeep(deepConfig)
    setDeepConfig(temp)
  }

  /**
   * 删除已添加字段
   * @param {Object} item option选项对象
   * @param {IBaseFieldDescription} item.description 描述
   * @param {string} item.id 对象ID
   * @param {boolean} item.isPrimary ///
   * @param {string} item.name 对象文本
   * @param {FieldType} item.type 对象类型
   */
  const handleDelete = item => {
    const temp = cloneDeep(deepConfig)
    temp.show_fields = temp.show_fields.filter(d => d.id !== item.id);
    setDeepConfig(temp)
  }

  // 选择下拉添加字段
  function onAddField(id) {
    const temp = cloneDeep(deepConfig)
    temp.show_fields = temp.show_fields.concat(deepConfig.all_fields?.find(d => d.id === id))
    setDeepConfig(temp)
    setShowAddField(false)
  }

  // 选择筛选字段
  const onAddFilter = (id) => {
    setFilterData({
      column: {
        id,
        name: deepConfig.all_fields?.find(d => d.id === id).name
      },
      type: filterList?.find(d => d.value === id).type,
      condition: '',
      value: ''
    })
  }

  // 筛选条件修改
  const onConditionChange = (value) => {
    const tempFilter = cloneDeep(filterData)
    setFilterData(Object.assign(tempFilter, {
      condition: value,
      value: ''
    }))
  }

  // 点击添加字段按钮显示下拉框
  const handleShowAddFields = () => {
    setShowAddField(true)
  }

  // 切换显示隐藏移动端
  const handlePhoneToggle = item => {
    const temp = cloneDeep(deepConfig)
    const result = temp.show_fields.map(d => {
      if (d.id === item.id) {
        d.is_phone_filed = !d.is_phone_filed
      }
      return d
    })
    setDeepConfig(temp)
  }

  // 修改桌面端行数
  const handlePcLineChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.pc_line = value
    setDeepConfig(temp)
  }

  // 修改移动端行数
  const handlePhoneLineChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.phone_line = value
    setDeepConfig(temp)
  }

  // 修改滚动模式
  const handleScrollMethodChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.scroll_method = value
    setDeepConfig(temp)
  }

  // 修改滚动间隔
  const handleScrollTimeChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.scroll_time = value
    setDeepConfig(temp)
  }

  // 修改高亮状态
  const handleLineHeightChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.is_line_height = value
    setDeepConfig(temp)
  }

  // 修改高亮行
  const handleLineHeightRowChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.line_height_row = value
    setDeepConfig(temp)
  }

  // 修改高亮行数
  const handleAppointLineHeightChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.appoint_line_heights = value
    setDeepConfig(temp)
  }

  // 修改亮色背景
  const handleLightBgChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.line_hgith_light_bg = value
    setDeepConfig(temp)
  }

  // 修改深色背景
  const handleDarkBgChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.line_hgith_dark_bg = value
    setDeepConfig(temp)
  }

  // 修改文本滚动开关
  const handleEllipsisChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.overflow_ellipsis = value
    setDeepConfig(temp)
  }

  // 修改文本滚动速率
  const handleTextSpeedChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.text_speed = value
    setDeepConfig(temp)
  }

  // 修改斑马纹开关
  const handleIsZebraChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.is_zebra = value
    setDeepConfig(temp)
  }

  // 修改斑马纹奇数行浅色背景
  const handleZebraOddLightBgChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.zebra_odd_light_bg = value
    setDeepConfig(temp)
  }

  // 修改斑马纹奇数行深色背景
  const handleZebraOddDarkBgChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.zebra_odd_dark_bg = value
    setDeepConfig(temp)
  }

  // 修改斑马纹偶数行浅色背景
  const handleZebraEvenLightBgChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.zebra_even_light_bg = value
    setDeepConfig(temp)
  }

  // 修改斑马纹偶数行深色背景
  const handleZebraEvenDarkBgChange = value => {
    const temp = cloneDeep(deepConfig)
    temp.zebra_even_dark_bg = value
    setDeepConfig(temp)
  }

  // 添加筛选条件
  const handleShowAddFilter = () => {
    setShowAddFilter(true)
    setFilterData({
      // column: deepConfig.all_fields?.find(d => d.id === filterList[0].value),
      // type: filterList[0].type,
      column: {},
      type: '',
      condition: '',
      value: ''
    })
  }

  const handleAddFilter = () => {
    if (!filterData.column.id || !filterData.condition) {
      return Toast.error("请填写筛选条件");
    }
    if ([5, 1001, 1002].includes(filterData.type) && !filterData.value) {
      return Toast.error("请填写筛选条件");
    }
    const temp = cloneDeep(deepConfig)
    temp.filters = temp.filters.concat(filterData)
    setDeepConfig(temp)
    setShowAddFilter(false)
  }

  // 确定添加
  const handleSure = async () => {
    if (!dashboard) {
      return ;
    }
    const dataConditions = {
      tableId: deepConfig.data_sorce,
      baseToken,
    }

    deepConfig.all_fields = deepConfig.all_fields.map(d => {
      return {
        id: d.id,
        name: d.name,
        type: d.type,
        property: [2, 19].includes(d.type) ? {
          refFieldId: d.property.refFieldId,
          refTableId: d.property.refTableId
        } : null
      }
    })
    dashboard.saveConfig({
      dataConditions,
      customConfig: deepConfig
    })
  }

  useEffect(() => {  // 数据初始化
    const fieldList = allFields?.map(d => {
      return {
        value: d?.id,
        label: d?.name,
        key: d?.id,
        disabled: deepConfig.show_fields.some(item => item.id === d.id)
      }
    })
    setAllField(fieldList)
  }, [deepConfig.show_fields, allFields]);

  const getActualType = async (col) => {
    if (!bitable) {
      return col.type
    }
    if (col.type === 19) {
      const lookupFieldId = col.property.refFieldId
      const quoteTableId = col.property.refTableId
      const table = quoteTableId ? await bitable.base.getTable(quoteTableId) : null
      const lookupField = await table?.getField(lookupFieldId)
      const cellType = await lookupField.getType()
      return cellType
    } else {
      return  col.type
    }
  }

  const handleDeleteFilter = (item) => {
    const temp = cloneDeep(deepConfig)
    temp.filters = temp.filters.filter(d => d.column.id !== item.column.id);
    setDeepConfig(temp)
  }

  const onFilterTextChange = (val) => {
    const temp = cloneDeep(deepConfig)
    temp.filter_text = val
    setDeepConfig(temp)
  }

  const getFilterCondition = () => {
    return filterCondition.filter(d => d.type.includes(filterData.type))
  }

  useEffect(() => {
    const temp = cloneDeep(allFields)
    Promise.all(temp?.map(async d => {
      d.actualType = await getActualType(d)
    })).then(res => {
      const filter = temp?.filter(d => [5, 7, 1001, 1002].includes(d.actualType) && !deepConfig.filters?.some(item => item.column.id === d.id)).map(d => {
        return {
          value: d?.id,
          label: d?.name,
          key: d?.id,
          type: d?.actualType,
        }
      })
      setFilterList(filter)
    })
  }, [allFields, deepConfig.filters]);

  const bannerTips = '受限于浏览器性能和插件的数据处理能力，推荐展示小于 5000 条的数据，超出上限请设置筛选后展示。';

  return (
    <div className="right-box">
      <Banner fullMode={false} type="warning" closeIcon={null} description={bannerTips} />
      <Form ref={formRef} style={{overflow: "auto", height: "100%"}}>
        {
          bitableContext?.needChangeBase && 
          <Form.Slot
            field="data_sorce"
            label={{ children: 
              <div className={"label base-label"} style={{ marginTop: 8 }}>
                多维表格
                <Tooltip
                  content=
                    "仅支持选择当前空间内有可编辑及以上权限的多维表格。若多维表格开启了高级权限，则需拥有可管理及以上权限"
                >
                  <span className="info-icon">
                    <svg
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-icon="InfoOutlined"
                    >
                      <path
                        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 2C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11Zm-1-7.5v-4a1 1 0 1 1 0-2h1.004c.55 0 .998.445.998.996.003 1.668-.002 3.336-.002 5.004h.5a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2h.5Zm1-7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </span>
                </Tooltip>
              </div>
             }}
          >
            <BaseSelector
              baseToken={baseToken}
              onChange={onChangeBase}
            />
          </Form.Slot>
        }
        <Form.Select
          field="data_sorce"
          label={{ text: "数据源" }}
          onChange={onChangeSource}
          optionList={dataSource.map(d => {
            return {
              value: d?.id,
              label: d?.name,
              key: d?.id
            }
          })}
        />
        <Form.Select
          field="data_range"
          label={{ text: "数据范围" }}
          onChange={onChangeRange}
          optionList={[{ value: 'all', label: '全部数据', key: 'all' }].concat(dataRange.map(d => {
            return {
              value: d?.id,
              label: d?.name,
              key: d?.id
            }
          }))}
        />
        <Form.Slot label={{ text: "字段" }}>
          {deepConfig.show_fields?.map((item) => (
            <div key={item.title} className="field-item">
              <div className="field-item-title">
                {["text".includes(item.type)] && <IconMark />}
                <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
              </div>
              <div className="field-item-phone" onClick={() => handlePhoneToggle(item)}>
                {item.is_phone_filed ? <IconEyeOpened /> : <IconEyeClosed />}
                移动端
              </div>
              <IconDelete
                className="field-item-delete"
                onClick={() => handleDelete(item)}
              />
            </div>
          ))}
          <Button
            theme="borderless"
            type="primary"
            className="field-item-add-btn"
            onClick={handleShowAddFields}
          >
            <IconPlus />
            添加字段
          </Button>
          {showAddField && <Select
            filter
            placeholder="搜索"
            className="add-line-select"
            onChange={onAddField}
            optionList={allField}
          >
          </Select>}
        </Form.Slot>
        {/*<Form.Slot label={{ text: "筛选" }}>
          {deepConfig.filters?.map((item) => (
            <>
              <div key={item.title} className="filter-item field-item">
                <div className="filter-name field-item-title">
                  <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>{item.column.name}</div>
                </div>
                <div className="filter-condition field-item-title">
                  <div style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>{filterCondition?.find(d => d.value === item.condition).label}</div>
                </div>
                <div className="filter-value field-item-title">
                  <FilterInput
                    data={item}
                    value={item.value}
                    disabled={true}
                  />
                </div>
                <IconDelete
                  className="field-item-delete"
                  onClick={() => handleDeleteFilter(item)}
                />
                {
                  [5, 1001, 1002].includes(item.type) ? (<div style={{width: '20px'}}></div>) : (
                    <>
                      <div className="filter-value field-item-title">
                        <FilterInput
                          data={item}
                          value={item.value}
                          disabled={true}
                        />
                      </div>
                      <IconDelete
                        className="field-item-delete"
                        onClick={() => handleDeleteFilter(item)}
                      />
                    </>
                  )
                }
              </div>
              {
                [5, 1001, 1002].includes(item.type) ? (
                  <>
                    <div className="filter-item field-item">
                      <div className="filter-value field-item-title">
                        <FilterInput
                          data={item}
                          value={item.value}
                          disabled={true}
                        />
                      </div>
                      <IconDelete
                        className="field-item-delete"
                        onClick={() => handleDeleteFilter(item)}
                      />
                    </div>
                  </>
                ) : ''
              }
            </>
          ))}
          <div className="filter-bottom">
            <Button
              theme="borderless"
              type="primary"
              className="field-item-add-btn"
              onClick={handleShowAddFilter}
            >
              <IconPlus/>
              添加条件
            </Button>
            {deepConfig.filters.length > 1 && <span className="filter-text">
              <div className="text">符合</div>
              <Select
                className="filter-text-select"
                optionList={[{label: '所有', value: 'and'}, {label: '任一', value: 'or'}]}
                onChange={onFilterTextChange}
                value={deepConfig.filter_text}
              />
              <div className="text">条件</div>
            </span>}
          </div>
          {showAddFilter &&
            <>
              <div className="add-condition-panel">
                <Select
                  filter
                  placeholder="搜索"
                  className="filter-name"
                  onChange={onAddFilter}
                  optionList={filterList}
                  value={filterData.column.id}
                />
                <Select
                  className="filter-condition"
                  optionList={getFilterCondition()}
                  onChange={onConditionChange}
                  value={filterData.condition}
                />
                <span
                  className="filter-value"
                >
                  <ConfigContext.Provider value={{filterData, setFilterData}}>
                      <FilterInput
                        data={filterData}
                        value={filterData.value}
                      />
                  </ConfigContext.Provider>
                </span>
              </div>
              <div className="add-condition-btn">
                <Button
                  theme="solid"
                  type="primary"
                  className="submit-btn"
                  onClick={handleAddFilter}
                  style={{width: "70px"}}
                >
                  确定
                </Button>
              </div>
            </>}
        </Form.Slot>*/}
        <Form.Slot label={{text: "行数"}}>
          <div className="form-second-box">
            <div>
              <Form.Label text="桌面端" style={{fontSize: "12px"}}></Form.Label>
              <InputNumber
                min={0}
                value={deepConfig.pc_line}
                onChange={handlePcLineChange}
              />
            </div>
            <div className="form-second-box-item-2">
              <Form.Label text="移动端" style={{fontSize: "12px"}}></Form.Label>
              <InputNumber
                min={0}
                value={deepConfig.phone_line}
                onChange={handlePhoneLineChange}
              />
            </div>
          </div>
        </Form.Slot>
        <Form.Slot label={{ text: "滚动" }}>
          <div className="form-second-box">
            <div className="form-second-box-item">
              <Form.Label text="模式" style={{ fontSize: "12px" }}></Form.Label>
              <Select
                filter
                value={deepConfig.scroll_method}
                onChange={handleScrollMethodChange}
              >
                <Select.Option value="line">单行</Select.Option>
                <Select.Option value="page">整页</Select.Option>
              </Select>
            </div>
            <div className="form-second-box-item form-second-box-item-2">
              <Form.Label text="间隔" style={{ fontSize: "12px" }}></Form.Label>
              <InputNumber
                suffix={"s"}
                value={deepConfig.scroll_time}
                onChange={handleScrollTimeChange}
              />
            </div>
          </div>
        </Form.Slot>
        <div className="switch-header">
          <Form.Label text="高亮"></Form.Label>
          <Switch
            checked={deepConfig.is_line_height}
            onChange={handleLineHeightChange} />
        </div>
        {
          deepConfig.is_line_height &&
          <div className="form-second-box">
            <div className="form-second-box-item">
              <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <Form.Label text="高亮行" style={{ fontSize: "12px" }}></Form.Label>
                <div className="line-height-card-box">
                  <div
                    className={`line-height-card ${deepConfig.line_height_row === 'first' && "line-height-card-active"
                      }`}
                    onClick={() => handleLineHeightRowChange('first')}
                  >
                    <span>首行</span>
                  </div>
                  <div
                    className={`line-height-card ${deepConfig.line_height_row === 'appoint' && "line-height-card-active"
                      }`}
                    onClick={() => handleLineHeightRowChange('appoint')}
                  >
                    <span>指定行</span>
                  </div>
                </div>
                {
                  deepConfig.line_height_row === 'appoint' &&
                  <Input
                    className="w-100-25"
                    placeholder="通过逗号分隔，例如：1,3,5"
                    value={deepConfig.appoint_line_heights}
                    onChange={handleAppointLineHeightChange}
                    style={{ marginTop: "10px" }}
                  />
                }
              </div>
              <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <Form.Label text="背景色" style={{ fontSize: "12px" }}></Form.Label>
                <div className="line-height-color-box w-100-25">
                  <div className="line-height-color-item">
                    <label htmlFor="label-form-1" style={{ fontSize: "12px" }}>浅色模式</label>
                    <input
                      type="color"
                      style={{ width: "24px", height: "20" }}
                      id="label-form-1"
                      value={deepConfig.line_hgith_light_bg}
                      onChange={e => handleLightBgChange(e.target.value)}
                    />
                  </div>
                  <div className="line-height-color-item">
                    <label htmlFor="label-form-2" style={{ fontSize: "12px" }}>深色模式</label>
                    <input
                      type="color"
                      id="label-form-2"
                      style={{ width: "24px", height: "20" }}
                      value={deepConfig.line_hgith_dark_bg}
                      onChange={e => handleDarkBgChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <div className="switch-header">
          <Form.Label text="溢出文本滚动"></Form.Label>
          <Switch
            checked={deepConfig.overflow_ellipsis}
            onChange={handleEllipsisChange}
          />
        </div>
        {deepConfig.overflow_ellipsis &&
          <div className="form-second-box">
            <div className="form-second-box-item">
              <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <Form.Label text="速率" style={{ fontSize: "12px" }}></Form.Label>
                <div className="line-height-color-box w-100">
                  <InputNumber
                    value={deepConfig.text_speed}
                    suffix={"px/s"}
                    onChange={handleTextSpeedChange}
                    style={{width: "100%"}}
                  />
                </div>
              </div>
            </div>
          </div>
        }
        <div className="switch-header">
          <Form.Label text="斑马纹"></Form.Label>
          <Switch
            checked={deepConfig.is_zebra}
            onChange={handleIsZebraChange}
          />
        </div>
        {deepConfig.is_zebra &&
          <div className="form-second-box">
            <div className="form-second-box-item">
              <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <Form.Label text="奇行背景色" style={{ fontSize: "12px" }}></Form.Label>
                <div className="line-height-color-box w-100-25">
                  <div className="line-height-color-item">
                    <label htmlFor="label-form-3" style={{ fontSize: "12px" }}>浅色模式</label>
                    <input
                      type="color"
                      style={{ width: "24px", height: "20" }}
                      id="label-form-3"
                      value={deepConfig.zebra_odd_light_bg}
                      onChange={e => handleZebraOddLightBgChange(e.target.value)}
                    />
                  </div>
                  <div className="line-height-color-item">
                    <label htmlFor="label-form-4" style={{ fontSize: "12px" }}>深色模式</label>
                    <input
                      type="color"
                      style={{ width: "24px", height: "20" }}
                      id="label-form-4"
                      value={deepConfig.zebra_odd_dark_bg}
                      onChange={e => handleZebraOddDarkBgChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <Form.Label text="偶行背景色" style={{ fontSize: "12px" }}></Form.Label>
                <div className="line-height-color-box w-100-25">
                  <div className="line-height-color-item">
                    <label htmlFor="label-form-5" style={{ fontSize: "12px" }}>浅色模式</label>
                    <input
                      type="color"
                      id="label-form-5"
                      style={{ width: "24px", height: "20" }}
                      value={deepConfig.zebra_even_light_bg}
                      onChange={e => handleZebraEvenLightBgChange(e.target.value)}
                    />
                  </div>
                  <div className="line-height-color-item">
                    <label htmlFor="label-form-6" style={{ fontSize: "12px" }}>深色模式</label>
                    <input
                      type="color"
                      id="label-form-6"
                      style={{ width: "24px", height: "20" }}
                      value={deepConfig.zebra_even_dark_bg}
                      onChange={e => handleZebraEvenDarkBgChange(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </Form>
      <div className="submit-panel">
          <Button
            theme="solid"
            type="primary"
            className="submit-btn"
            onClick={handleSure}
            style={{width: "70px"}}
          >
            确定
          </Button>
        </div>
    </div>
  );
})



export default App;

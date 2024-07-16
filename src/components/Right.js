import React, { useEffect, useState, useRef, forwardRef, useContext } from "react";
import {
  Select,
  Form,
  Button,
  InputNumber,
  Switch,
  Input,
} from "@douyinfe/semi-ui";
import {
  getDataSource,
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
import { cloneDeep } from "@douyinfe/semi-ui/lib/es/_utils";
import ConfigContext from "./ConfigContext";
import { bitable, dashboard } from "@lark-base-open/js-sdk";

const App = forwardRef((props, ref) => {
  const { deepConfig, setDeepConfig } = useContext(ConfigContext)
  const { dataSource, allFields } = props; // 全局配置
  const formRef = useRef(); // form组件
  const [dataRange, setDataRange] = useState([]); // 数据范围下拉
  const [allField, setAllField] = useState([]); // 选择字段下拉
  const [showAddField, setShowAddField] = useState(false); //设置添加字段下拉框
  commonInfo.deepConfig = deepConfig;
  commonInfo.setDeepConfig = setDeepConfig;
  commonInfo.formRef = formRef;
  commonInfo.setDataRange = setDataRange;

  // 修改数据源
  const onChangeSource = async (value) => {
    await changeSource(value);
    const temp = cloneDeep(deepConfig)
    setDeepConfig(temp)
  }

  // 修改数据范围
  const onChangeRange = async (value) => {
    await getAllFields(value);
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
    temp.show_fields = temp.show_fields.concat(deepConfig.all_fields.find(d => d.id === id))
    setDeepConfig(temp)
    setShowAddField(false)
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

  // 确定添加
  const handleSure = async () => {
    const dataConditions = {
      tableId: deepConfig.data_sorce,
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


  return (
    <div className="right-box">
      <Form ref={formRef} style={{overflow: "auto", height: "100%"}}>
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
        <Form.Slot label={{ text: "行数" }}>
          <div className="form-second-box">
            <div>
              <Form.Label text="桌面端" style={{ fontSize: "12px" }}></Form.Label>
              <InputNumber
                min={0}
                value={deepConfig.pc_line}
                onChange={handlePcLineChange}
              />
            </div>
            <div className="form-second-box-item-2">
              <Form.Label text="移动端" style={{ fontSize: "12px" }}></Form.Label>
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

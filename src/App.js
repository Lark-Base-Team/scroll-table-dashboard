import "./App.scss";
import Left from "./components/Left";
import Right from "./components/Right";
import config from "./components/config";
import { useEffect, useRef, useState } from "react";
import { commonInfo, getDataSource } from "./components/const";
import ConfigContext from "./components/ConfigContext";
import { dashboard, bitable } from "@lark-base-open/js-sdk";
import { my_plat } from "./utils/computed";
import { Toast } from "@douyinfe/semi-ui";
window.__bitable = bitable;


function App() {
  const [deepConfig, setDeepConfig] = useState(config);
  const [allFields, setAllFields] = useState([]);
  const appRef = useRef();
  const rightRef = useRef();
  const [appHeight, setAppHeight] = useState(0);
  const [mainTheme, setMainTheme] = useState('LIGHT')
  const [currentTheme, setCurrentTheme] = useState();
  const [themeConfig, setThemeConfig] = useState();

  const [currentState, setCurrentState] = useState('config');

  // 当前数据表下的viewMetaList
  const [currentViewMetaList, setCurrentViewMetaList] = useState([]);

  // 当前数据表下的fieldMetaList
  const [currentFieldMetaList, setCurrentFieldMetaList] = useState([])
  const [loading, setLoading] = useState(false);

  const [formConfig, setFormConfig] = useState({
    /** 数据表 */
    data_sorce: '',
    /** 数据范围 */
    data_range: '',
    /** 展示字段, {id:string,mob:boolean}[] */
    show_fields: [],
    /** 桌面端 */
    pc_line: 10,
    /** 移动端 */
    phone_line: 3,
    /** 模式 line / page */
    scroll_method: 'line',
    /** 间隔/s */
    scroll_time: 2,
    /** 高亮 */
    is_line_height: false,
    /** 哪些行高亮 first / appoint */
    line_height_row: 'first',
    /** 当appoint为appoint的时候出现。 通过逗号分隔，例如：1 */
    appoint_line_heights: '',
    /** 浅色模式背景色 */
    line_hgith_light_bg: '#000000',
    /** 深色模式背景色 */
    line_hgith_dark_bg: '#000000',
    /** 文本溢出滚动？ */
    overflow_ellipsis: false,
    /** 文本溢出滚动速率 */
    text_speed: 2,
    /** 斑马纹? */
    is_zebra: false,
    /** 斑马偶行浅色 */
    zebra_even_light_bg: '#000000',
    /** 斑马偶行深色 */
    zebra_even_dark_bg: '#000000',
    /** 斑马奇行浅色 */
    zebra_odd_light_bg: '#000000',
    /** 斑马奇行深色 */
    zebra_odd_dark_bg: '#000000',
  });

  const ctxRef = useRef({
    formConfig
  });
  ctxRef.current = {
    formConfig,
  }
  const [tableMetaList, setTableMetaList] = useState([])

  commonInfo.appRef = appRef

  console.log('========', {
    tableMetaList,
    formConfig,
    currentFieldMetaList,
    appRef,
    currentViewMetaList,
  })

  const state = dashboard.state

  useEffect(() => {
    async function init() {
      // 获取表格信息列表
      const tableMetaList = await bitable.base.getTableMetaList();
      setTableMetaList(tableMetaList);
    }

    init();
  }, [])

  // 初始化之后，修改数据表
  useEffect(() => {
    async function updateFields() {
      if (!formConfig.data_sorce) {
        return;
      }
      setLoading(true);
      const table = await bitable.base.getTableById(formConfig.data_sorce);
      if (!table) {
        setFormConfig({
          ...ctxRef.current.formConfig,
          data_sorce: '',
        });
        Toast.error('数据表已被删除');
        setLoading(false);
      }
      const viewMetaList = await table.getViewMetaList();
      const gridViewMetaList = viewMetaList.filter((v) => v.type === 1);
      let newDataRange = ctxRef.current.formConfig.data_range;
      let newShowFields = ctxRef.current.formConfig.show_fields;
      const fieldMetaList = await table.getFieldMetaList();

      if (!gridViewMetaList.some(v => v.id === newDataRange)) {
        newDataRange = 'all';
      }
      const fieldIdList = fieldMetaList.map(v => v.id)
      newShowFields = newShowFields.filter((v) => fieldIdList.includes(v.id));


      setCurrentFieldMetaList(fieldMetaList)
      setCurrentViewMetaList(gridViewMetaList);
      setFormConfig({
        ...ctxRef.current.formConfig,
        data_range: newDataRange,
        show_fields: newShowFields,
      });
      rightRef.current?.formRef?.current?.formApi.setValue?.('data_range', newDataRange);
      rightRef.current?.formRef?.current?.formApi.setValue?.('data_sorce', formConfig.data_sorce);
      setLoading(false);
    }
    updateFields();
  }, [formConfig.data_sorce])

  useEffect(() => {
    const setH = () => {
      setAppHeight(appRef.current?.offsetHeight);
    }
    dashboard.getConfig().then(({ customConfig, dataConditions }) => {
      console.log('=====customConfig 初始化', customConfig)
      setFormConfig(customConfig);
    })

    setAppHeight(appRef.current?.offsetHeight);
    window.addEventListener('resize', setH);


    /*
    
    View = "View",
    FullScreen = "FullScreen"
    */
    if (dashboard.state === 'View' || dashboard.state === 'FullScreen') {
      dashboard.onConfigChange(() => {
        dashboard.getConfig().then(({ customConfig, dataConditions }) => {
          console.log('=====customConfig onChange事件', customConfig)
          setFormConfig(customConfig);
        })
      })
    }


    return () => {
      window.removeEventListener('resize', setH);
    }
  }, []);

  useEffect(() => {
    dashboard.onThemeChange(theme => {
      console.log('??? theme', theme);
      setCurrentTheme(theme.data);
      setTheme(theme.data)
      // updateTheme(theme.data.theme);
    })
  }, []);

  useEffect(() => {
    setAllFields(deepConfig.all_fields)
  }, [deepConfig]);

  const getTheme = async () => {
    // const theme = await bitable.bridge.getTheme();
    // setTheme(theme)
    // await bitable.bridge.onThemeChange((event) => {
    //   setTheme(event.data.theme)
    // });

    const theme = await dashboard.getTheme();
    setCurrentTheme(theme);
    setTheme(theme)
    // setThemeConfig(theme);
  }

  const setTheme = (theme) => {
    setMainTheme(theme)
    const body = document.body;
    if (theme.theme === 'LIGHT') {
      body.removeAttribute('theme-mode');
    } else {
      body.setAttribute('theme-mode', 'dark');
    }
  }


  return (
    <div id="app-box" ref={appRef} style={{ background: currentTheme?.chartBgColor }}>
      <ConfigContext.Provider value={{ formConfig, appHeight, setAppHeight, mainTheme, setMainTheme, currentTheme, setCurrentTheme }}>
        <Left
          key={formConfig.data_sorce + '' + formConfig.data_range}
          formConfig={formConfig}
        />
      </ConfigContext.Provider>
      {state === 'Config' || state === 'Create'
        ? (
          <ConfigContext.Provider value={{ deepConfig, setDeepConfig, mainTheme, setMainTheme, formConfig, setFormConfig }}>
            <Right
              dataSource={tableMetaList}
              currentViewMetaList={currentViewMetaList}
              currentFieldMetaList={currentFieldMetaList}
              allFields={allFields}
              ref={rightRef}
            />
          </ConfigContext.Provider>
        )
        : ''
      }
    </div>
  );
}

export default App;
import "./App.scss";
import Left from "./components/Left";
import Right from "./components/Right";
import config from "./components/config";
import {useEffect, useRef, useState} from "react";
import {commonInfo, getDataSource} from "./components/const";
import ConfigContext from "./components/ConfigContext";
import { useBitableContext } from "./hooks";
import { getCurrentState } from "./utils/common";
import { useErrorComponent, ErrorType } from "./components/errors/hooks";



function App() {
  const [deepConfig, _setDeepConfig] = useState(config);
  const [dataSource, setDataSource] = useState([]); // 数据源下拉
  const [allFields, setAllFields] = useState([]);
  const appRef = useRef()
  const [appHeight, setAppHeight] = useState(0);
  const [mainTheme, setMainTheme] = useState('LIGHT')
  const [currentTheme, setCurrentTheme] = useState();
  const [inited, setInited] = useState(false);
  const {
    setError,
    component: errorComponent,
  } = useErrorComponent();
  const bitableContext = useBitableContext({setError});
  const [renderLoading, setRenderLoading] = useState(false);
  const {
    bitable,
  } = bitableContext ?? {};
  const dashboard = bitable?.dashboard;

  const setDeepConfig = (...args) => {
    const res = _setDeepConfig(...args);
    return res;
  }


  const [themeConfig, setThemeConfig] = useState();

  commonInfo.appRef = appRef
  commonInfo.setRenderLoading = setRenderLoading;
  commonInfo.setError = setError;



  const state = getCurrentState();

  useEffect(() => {
    if (!dashboard) {
      return;
    }

    let cancelDataChange = null;
    if (state === 'View' || state === 'FullScreen') {
      cancelDataChange = dashboard.onDataChange((e) => {
        getConfig(dashboard).then(async (config) => {
          getDataSource(bitable, config).then((res) => {
            setDataSource(res)
            setAllFields(config ? config.all_fields : deepConfig.all_fields)
          });
        })
      })
    }
    getTheme()
    const cancel = dashboard.onThemeChange(theme => {
      console.log('??? theme', theme);
      setCurrentTheme(theme.data);
      setTheme(theme.data)
      // updateTheme(theme.data.theme);
    })

    return () => {
      cancelDataChange?.();
      cancel();
    }
  }, [dashboard, bitable]);

  useEffect(() => {
    if (!dashboard || inited) {
      return;
    }

    getConfig(dashboard).then(async (config) => {
      
      getDataSource(bitable, config).then((res) => {
        setDataSource(res)
        setAllFields(config ? config.all_fields : deepConfig.all_fields)
      });
      setAppHeight(appRef.current.offsetHeight)
      
      setInited(true);
    })
    const setH = () => {
      setAppHeight(appRef.current.offsetHeight);
    };
    window.addEventListener('resize', setH)

    return () => {
      window.removeEventListener('resize', setH)
    }
  }, [dashboard, bitable])

  useEffect(() => {
    if(!inited) {
      return;
    }
    getDataSource(bitable).then((res) => {
      setDataSource(res)
      setAllFields(config ? config.all_fields : deepConfig.all_fields)
    });
  }, [bitable])

  useEffect(() => {
    setAllFields(deepConfig.all_fields)
  }, [deepConfig]);

  const getTheme = async () => {
    // const theme = await bitable.bridge.getTheme();
    // setTheme(theme)
    // await bitable.bridge.onThemeChange((event) => {
    //   setTheme(event.data.theme)
    // });
    if (!dashboard) {
      return;
    }

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

  const getConfig = async (dashboard) => {
    return new Promise(async (resolve, reject) => {
      if (dashboard.state === 'View' || dashboard.state === 'FullScreen' || dashboard.state === 'Config') {
        const config = (await dashboard.getConfig()).customConfig
        setDeepConfig(config)
        resolve(config)
      } else {
        resolve()
      }
    })
  }

  return (
    <div id="app-box" ref={appRef} style={{ background: currentTheme?.chartBgColor }}>
      <ConfigContext.Provider value={{deepConfig, setDeepConfig, appHeight, setAppHeight, mainTheme, setMainTheme, currentTheme, setCurrentTheme}}>
        {errorComponent ? errorComponent : <Left
          deepConfig={deepConfig}
          bitableContext={bitableContext}
          loading={renderLoading}
        />}
      </ConfigContext.Provider>
      { state === 'Config' || state === 'Create'
        ? (
          <ConfigContext.Provider value={{deepConfig, setDeepConfig, mainTheme, setMainTheme}}>
            <Right
              dataSource={dataSource}
              allFields={allFields}
              bitableContext={bitableContext}
              setDataSource={setDataSource}
              setRenderLoading={setRenderLoading}
            />
          </ConfigContext.Provider>
        )
        : ''
      }
    </div>
  );
}

export default App;
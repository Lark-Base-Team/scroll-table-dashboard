import { workspace, bitable as defaultBitable, DashboardState } from "@lark-base-open/js-sdk";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getDefaultBaseToken, getNeedChangeBase } from "../utils/base";
import { getCurrentState } from "../utils/common";
import { ErrorType } from "../components/errors/hooks";

// export interface BitableContext {
//   loading: boolean;
//   bitable: typeof defaultBitable
//   needChangeBase: boolean;
//   baseToken: string;
//   changeBase: (baseToken: string) => Promise<void>;
// }

export const useBitableContext = ({setError}) => {
  const [bitable, setBitable] = useState(null);
  const [baseToken, setBaseToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [needChangeBase, setNeedChangeBase] = useState(false);
  const isView = getCurrentState() === DashboardState.View;

  const updateBitable = useCallback(async (baseToken) => {
    let bitable;
    try {
      // 应用非编辑台获取bitable有问题，临时通过通过获取导入的bitable渲染数据
      if(isView) {
        return bitable;
      }
      bitable = await workspace.getBitable(baseToken);
    } catch (error) {
      setError(ErrorType.NOT_FOUND);
      console.error('get bitable failed', error);
      throw error;
    }
    setBitable(bitable);
    setBaseToken(baseToken);
    return bitable;
  }, []);

  const changeBase = useCallback(async (baseToken) => {
    let bitable = null;
    try{
      setLoading(true);
      bitable = await updateBitable(baseToken);
    } finally {
      setLoading(false);
    }
    return bitable
  }, [updateBitable]);

  useEffect(() => {
    const init = async () => {
      const needChangeBase = await getNeedChangeBase();
      // 若不需要base，则可以直接用导出的bitable，如仪表盘插件
      // 应用非编辑台获取bitable有问题，临时通过通过获取导入的bitable渲染数据
      if (!needChangeBase || isView) {
        setBitable(defaultBitable);
        setNeedChangeBase(false);
        return ;
      }
      setNeedChangeBase(true);

      const defaultBaseToken = await getDefaultBaseToken();
      await updateBitable(defaultBaseToken);
    }

    init().finally(() => {
      setLoading(false);
    });
  }, []);

  const bitableContext = useMemo(() => ({
    loading,
    bitable,
    needChangeBase,
    baseToken,
    changeBase,
  }), [loading, bitable, needChangeBase, baseToken, changeBase]);

  return bitableContext;
}
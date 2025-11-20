import { workspace, bitable as defaultBitable } from "@lark-base-open/js-sdk";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getDefaultBaseToken, getNeedChangeBase } from "../utils/base";

// export interface BitableContext {
//   loading: boolean;
//   bitable: typeof defaultBitable
//   needChangeBase: boolean;
//   baseToken: string;
//   changeBase: (baseToken: string) => Promise<void>;
// }

export const useBitableContext = () => {
  const [bitable, setBitable] = useState(null);
  const [baseToken, setBaseToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [needChangeBase, setNeedChangeBase] = useState(false);

  const updateBitable = useCallback(async (baseToken) => {
    const bitable = await workspace.getBitable(baseToken);
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
      if (!needChangeBase) {
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

import { dashboard, bridge, workspace, DashboardState } from "@lark-base-open/js-sdk";
import { getCurrentState } from './common';


let cacheBaseToken = '';
export const getDefaultBaseToken = async () => {
  if (cacheBaseToken) return cacheBaseToken;
  const state = getCurrentState();
  const config = state === DashboardState.Create ? null : await dashboard.getConfig();
  // 从config中获取
  const defaultBaseToken = config?.dataConditions[0]?.baseToken || '';
  if (defaultBaseToken) {
    cacheBaseToken = defaultBaseToken;
    return defaultBaseToken;
  }
  // 从workspace接口获取第一个base
  // 一般来说一定可以从config获取可用的baseToken，这里用workspace做base获取的兜底
  const baseList = await workspace.getBaseList({});
  const firstBaseToken = baseList?.base_list?.[0]?.token || '';

  cacheBaseToken = firstBaseToken;
  return firstBaseToken;
}

let cacheNeedChangeBase = null;
export const getNeedChangeBase = async () => {
  if (cacheNeedChangeBase !== null) return cacheNeedChangeBase;
  const env = await bridge.getEnv();
  cacheNeedChangeBase = env.needChangeBase || false;
  return cacheNeedChangeBase;
}
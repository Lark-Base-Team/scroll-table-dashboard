import { NotFoundIllustration as NotFoundIllustrationComp  } from '../../assets/'
import './index.scss';

export const NotFoundIllustration = () => {
  return (
    <div className="empty">
      <NotFoundIllustrationComp />
      <div className="text">配置数据发生变更，请重新配置</div>
    </div>
  );
}

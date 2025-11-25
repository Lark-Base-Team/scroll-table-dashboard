import { NoPermissionIllustration as NoPermissionIllustrationComp } from '../../assets/'
import './index.scss';

export const NoPermissionIllustration = () => {
  return (
    <div className="empty">
      <NoPermissionIllustrationComp />
      <div className="text">无权限查看组件</div>
    </div>
  );
}

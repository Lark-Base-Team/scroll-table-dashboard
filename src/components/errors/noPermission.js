import noPermissionIllustration from '../../assets/illustration_empty-neutral-no-access.svg'
import './index.scss';

export const NoPermissionIllustration = () => {
  return (
    <div className="empty">
      <img className="illustration" src={noPermissionIllustration} />
      <div className="text">无权限查看组件</div>
    </div>
  );
}

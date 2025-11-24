import notFoundIllustration from '../../assets/illustration_empty-neutral-404.svg'
import './index.scss';

export const NotFoundIllustration = () => {
  return (
    <div className="empty">
      <img className="illustration" src={notFoundIllustration} />
      <div className="text">配置数据发生变更，请重新配置</div>
    </div>
  );
}

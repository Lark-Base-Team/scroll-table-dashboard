import { useMemo, useState } from "react";
import { NotFoundIllustration } from './notFound';
import { NoPermissionIllustration } from './noPermission';

export const ErrorType = {
  NOT_FOUND: 'NOT_FOUND',
  NO_PERMISSION: 'NO_PERMISSION',
}

export const useErrorComponent = () => {
  const [error, setError] = useState(null);

  const component = useMemo(() => {
    if(!error) {
      return null;
    }
    if(error === ErrorType.NOT_FOUND) {
      return <NotFoundIllustration/>;
    }
    if(error === ErrorType.NO_PERMISSION) {
      return <NoPermissionIllustration/>;
    }
    return null
  }, [error]);

  return {
    setError,
    component,
  }
}
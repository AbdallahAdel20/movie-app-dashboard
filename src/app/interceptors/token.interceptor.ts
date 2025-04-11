import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip adding token for asset requests
  if (req.url.includes('/assets') || req.url.includes('/movies/all') || req.url.includes('auth') || req.method === 'OPTIONS') {
    return next(req);
  }
  

  const token = localStorage.getItem('userToken');
  if (token) {
    const modifiedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, 
      },
      method : req.method
    });
    return next(modifiedRequest);
  }

  return next(req);
};

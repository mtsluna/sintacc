import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner/spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);

  console.log('Spinner Interceptor: Request started', req);

  spinnerService.show();
  return next(req).pipe(
    finalize(() => spinnerService.hide())
  );
};

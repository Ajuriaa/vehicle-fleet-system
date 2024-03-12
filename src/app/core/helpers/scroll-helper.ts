import { Router } from '@angular/router';

export class scrollHelper {
  public static init(router: Router): void {
    router.events.subscribe(() => {
      const selector = (document.querySelector('#scroll') as HTMLBodyElement);
      if (selector) { selector.scrollTop = 0; }
    });
  }
}

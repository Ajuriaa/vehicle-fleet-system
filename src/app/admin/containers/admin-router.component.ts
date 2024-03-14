import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { SideBarComponent } from 'src/app/shared';

@Component({
  selector: 'app-admin-router',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, SideBarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="container">
      <app-side-bar class="bar"></app-side-bar>
      <div class="component-container" id="scroll">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      height: 100%;
      width: 100%;
    }
    .bar {
      flex: none;
    }
    .component-container {
      overflow-y: auto;
      flex: 1;
    }
  `]
})
export class AdminRouterComponent {
}

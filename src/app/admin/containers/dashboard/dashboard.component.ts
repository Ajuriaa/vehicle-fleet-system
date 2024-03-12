import { Component } from '@angular/core';
import { SideBarComponent } from 'src/app/shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SideBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}

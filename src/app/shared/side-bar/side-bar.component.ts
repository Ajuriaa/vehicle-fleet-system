import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SideNavButtonComponent } from '../buttons';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatSidenavModule, SideNavButtonComponent, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  public selectedOption = 'dashboard';
  public toggleBar = false;
  public image = "assets/logo.png";

  constructor(private _router: Router){}

  public selectOption(option: string): void {
    this.selectedOption = option;
    this._router.navigate([`admin/`, option]);
  }

  public toggleSideNav(): void {
    this.toggleBar = !this.toggleBar;
  }

  public logout(): void {
    this._router.navigate([``]);
  }
}

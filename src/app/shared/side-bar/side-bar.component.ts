import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/core/services';
import { SideNavButtonComponent } from '../buttons';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatSidenavModule, SideNavButtonComponent, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  public selectedOption = 'dashboard';
  public iconTopPosition = 4.5;

  constructor(private _router: Router, private sharedData: SharedDataService){}

  ngOnInit(): void {
    this.selectedOption = this._router.url.split('/')[2];
    this.animateIcon();
  }

  public selectOption(option: string): void {
    this.selectedOption = option;
    this.animateIcon();
    setTimeout(() => this._router.navigate([`admin/`, option]), 500);
  }

  public logout(): void {
    this._router.navigate([``]);
  }

  animateIcon(): void {
    switch (this.selectedOption) {
      case 'dashboard':
        this.iconTopPosition = 4.5;
        break;
      case 'vehicles':
        this.iconTopPosition = 21;
        break;
      case 'drivers':
        this.iconTopPosition = 37.5;
        break;
      case 'maintenance':
        this.iconTopPosition = 54;
        break;
      case 'requests':
        this.iconTopPosition = 70.5;
        break;
      case 'logs':
        this.iconTopPosition = 87;
        break;
    }
  }
}

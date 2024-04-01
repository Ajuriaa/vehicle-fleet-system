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

  constructor(private _router: Router, private sharedData: SharedDataService){}

  ngOnInit(): void {
    this.selectedOption = this._router.url.split('/')[2];
  }
  public selectOption(option: string): void {
    this.selectedOption = option;
    this._router.navigate([`admin/`, option]);
  }

  public logout(): void {
    this._router.navigate([``]);
  }
}

import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SideNavButtonComponent } from '../buttons';
import { SharedDataService } from 'src/app/core/services';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MatSidenavModule, SideNavButtonComponent, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  public selectedOption = 'dashboard';
  public toggleBar = false;
  public image = "assets/logo.png";
  public position = this.sharedData.getPosition();

  constructor(private _router: Router, private sharedData: SharedDataService){}

  ngOnInit(): void {
    this.selectedOption = this._router.url.split('/')[2];
  }
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

  public transformFullName(): string {
    const fullName = this.sharedData.getName();
    const parts = fullName.trim().split(/\s+/);

    if (parts.length < 2) {
        return fullName;
    }

    return `${parts[0]} ${parts[parts.length - 2]}`;
  }
}

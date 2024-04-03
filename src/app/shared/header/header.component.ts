import { Component, OnInit } from '@angular/core';
import { NameHelper } from 'src/app/admin/helpers';
import { cookieHelper } from 'src/app/core/helpers';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  providers: [NameHelper, cookieHelper],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public position = this.cookieHelper.getPosition();
  public name = '';

  constructor(
    private cookieHelper: cookieHelper,
    public nameHelper: NameHelper
  ){}

  ngOnInit(): void {
    this.name = this.nameHelper.getShortName(this.cookieHelper.getName());
  }
}

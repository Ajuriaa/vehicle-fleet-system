import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { SharedDataService } from 'src/app/core/services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public position = this.sharedDataService.getPosition();

  constructor(
    private sharedDataService: SharedDataService
  ){}

  public transformFullName(): string {
    const fullName = this.sharedDataService.getName();
    const parts = fullName.trim().split(/\s+/);

    if (parts.length < 2) {
        return fullName;
    }

    return `${parts[0]} ${parts[parts.length - 2]}`;
  }
}

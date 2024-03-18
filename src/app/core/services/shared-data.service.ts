import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private role: number = 0;
  private name: string = '';
  private position: string = '';

  constructor() { }

  public getRole(): number {
    return this.role;
  }

  public setRole(role: number): void {
    this.role = role;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getPosition(): string {
    return this.position;
  }

  public setPosition(position: string): void {
    this.position = position;
  }
}

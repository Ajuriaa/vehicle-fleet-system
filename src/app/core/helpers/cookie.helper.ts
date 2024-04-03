export class cookieHelper {
  public _setCookie(token: string, user: string, name: string, position: string): void {
    document.cookie = `session_key=${token};path=/`;
    document.cookie = `usuario=${user};path=/`;
    document.cookie = `nombre=${name};path=/`;
    document.cookie = `cargo=${position};path=/`;
  }

  public getName(): string {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
      if (c.indexOf('nombre=') === 0) {
        return c.substring(7);
      }
    }
    return 'EMPLEADO';
  }

  public getPosition(): string {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
      if (c.indexOf('cargo=') === 0) {
        return c.substring(6);
      }
    }
    return 'CARGO';
  }

  public findToken(): boolean {
    const cookies = document.cookie.split('; ');
    for (const c of cookies) {
      if (c.indexOf('CK-TOKEN=') === 0) {
        return true;
      }
    }
    return false;
  }
}

export class cookieHelper {
  public _setCookie(token: string, user: string): void {
    document.cookie = `session_key=${token};path=/`;
    document.cookie = `usuario=${user};path=/`;
  }
}

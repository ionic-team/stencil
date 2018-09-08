

export class MockLocation {
  href = '';
  protocol = '';
  host = '';
  hostname = '';
  port = '';
  pathname = '';
  search = '';
  hash = '';
  username  = '';
  password = '';
  origin = '';

  assign(_url: string) {
    //
  }

  reload(_forcedReload?: boolean) {
    //
  }

  replace(_url: string) {
    //
  }

  toString() {
    return this.href;
  }

}

import { noop } from '../../util/helpers';


export class Location {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  origin: string;
  pathname: string;
  port: string;
  protocol: string;
  reload = noop;
  replace = noop;
  search: string;

  constructor(url: string) {
    // TODO
    this.href = url;
  }

}

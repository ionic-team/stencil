import * as nodeUrl from 'url';


export class Location {
  hash: string;
  host: string;
  hostname: string;
  href: string;
  origin: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;

  constructor(urlStr: string) {
    const parsedUrl = nodeUrl.parse(urlStr);

    this.hash = parsedUrl.hash;
    this.host = parsedUrl.host;
    this.hostname = parsedUrl.hostname;
    this.href = parsedUrl.href;
    this.origin = `${parsedUrl.protocol}//${parsedUrl.host}`;
    this.pathname = parsedUrl.pathname;
    this.port = parsedUrl.port;
    this.protocol = parsedUrl.protocol;
    this.search = parsedUrl.search;
  }

  // noops
  reload() {}
  replace() {}

}

/**
https://nodejs.org/api/url.html

A comparison between this API and url.parse() is given below. Above the URL
'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash', properties
of an object returned by url.parse() are shown. Below it are properties of a
WHATWG URL object.

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            href                                             │
├──────────┬──┬─────────────────────┬─────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │        host         │           path            │ hash  │
│          │  │                     ├──────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │   hostname   │ port │ pathname │     search     │       │
│          │  │                     │              │      │          ├─┬──────────────┤       │
│          │  │                     │              │      │          │ │    query     │       │
"  http:    //    user   :   pass   @ sub.host.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │   hostname   │ port │          │                │       │
│          │  │          │          ├──────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │        host         │          │                │       │
├──────────┴──┼──────────┴──────────┼─────────────────────┤          │                │       │
│   origin    │                     │       origin        │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴─────────────────────┴──────────┴────────────────┴───────┤
│                                            href                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

**/

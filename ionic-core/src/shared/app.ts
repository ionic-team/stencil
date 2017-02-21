

export class App {

  constructor() {
    console.time('App init');
  }

  isReady() {
    console.timeEnd('App init');
  }

}

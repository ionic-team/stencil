

export class Performance {
  private nodeLoadTime: number;

  constructor() {
    this.nodeLoadTime = getNanoSeconds() - (process.uptime() * 1e9);
  }

  now() {
    return (getNanoSeconds() - this.nodeLoadTime) / 1e6;
  }

}


function getNanoSeconds() {
  const hr = process.hrtime();
  return (hr[0] * 1e9) + hr[1];
}

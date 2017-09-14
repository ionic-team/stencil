class TestClass {
  x = 18;
  y = 24;
  sum() { return this.x + this.y; }
  render() {
    return (
      <div class='thing'>
        <div class='child-thing'>I am the eldest</div>
        <div class='child-thing'>Middle child rules</div>
        <div class='child-thing'>No youngest does</div>
        <div class='child-thing'>say wut now?</div>
        <div class='random-sum'>{this.sum()}</div>
      </div>
    );
  }
}

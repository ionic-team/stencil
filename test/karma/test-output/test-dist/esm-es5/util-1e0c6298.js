function timeout(t, e) {
  return new Promise((function(n) {
    setTimeout((function() {
      return n(e);
    }), t);
  }));
}

export { timeout as t };
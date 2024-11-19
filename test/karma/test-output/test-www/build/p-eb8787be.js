function timeout(t, e) {
  return new Promise((o => {
    setTimeout((() => o(e)), t);
  }));
}

export { timeout as t }
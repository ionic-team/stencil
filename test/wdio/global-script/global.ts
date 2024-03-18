declare global {
  interface Window {
    __testStart: number;
  }
}

export default async function () {
  window.__testStart = Date.now();
  return new Promise((resolve) => setTimeout(() => resolve('done!'), 1000));
}

declare global {
  // eslint-disable-next-line no-var
  var globalAsyncSetup: boolean;
}

export default async function () {
  console.log('Start async global setup');
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log('End async global setup');
  globalThis.globalAsyncSetup = true;
}

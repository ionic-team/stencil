
export const win = window as any;

export const doc = document;

export const raf: (callback: FrameRequestCallback) => void = (win as Window).requestAnimationFrame.bind(win);

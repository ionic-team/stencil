
export function spyOnEvent(el: Node, eventName: string) {
  const fn = jest.fn();
  el.addEventListener(eventName, (ev: any) => fn(ev.detail));
  return fn;
}

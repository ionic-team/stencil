

export function printLifecycle(isClient: boolean, cmp: string, lifecycle: string) {
  const elm = document.createElement('div');

  if (isClient) {
    const output = document.getElementById(`client-${lifecycle}`);
    elm.textContent = `${cmp} client ${lifecycle}`;
    output.appendChild(elm);

  } else {
    const output = document.getElementById(`server-${lifecycle}`);
    elm.textContent = `${cmp} server ${lifecycle}`;
    output.appendChild(elm);
  }

}

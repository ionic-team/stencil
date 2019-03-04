

export function stencilConsolePlugin() {
  return {
    resolveId(id: string) {
      if (id === '@stencil/core/console') {
        return id;
      }
      return null;
    },
    load(id: string) {
      if (id !== '@stencil/core/console') {
        return null;
      }

      return STENCIL_CONSOLE;
    }
  };
}

const STENCIL_CONSOLE = `
const consoleNoop = function() {};
export const console = {
  debug: consoleNoop,
  error: consoleNoop,
  info: consoleNoop,
  log: consoleNoop,
  warn: consoleNoop,
  dir: consoleNoop,
  dirxml: consoleNoop,
  table: consoleNoop,
  trace: consoleNoop,
  group: consoleNoop,
  groupCollapsed: consoleNoop,
  groupEnd: consoleNoop,
  clear: consoleNoop,
  count: consoleNoop,
  countReset: consoleNoop,
  assert: consoleNoop,
  profile: consoleNoop,
  profileEnd: consoleNoop,
  time: consoleNoop,
  timeLog: consoleNoop,
  timeEnd: consoleNoop,
  timeStamp: consoleNoop,
  context: consoleNoop,
  log: consoleNoop,
  log: consoleNoop,
  memory: consoleNoop
};
`;

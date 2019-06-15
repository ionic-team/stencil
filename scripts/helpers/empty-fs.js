
const emptyFsErrorSync = () => {
  throw new Error('fs not implemented within browser');
}

const emptyFsError = () => {
  var args = arguments;
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'function') {
      args[i](new Error('fs not implemented within browser'));
    }
  }
}

module.exports = {
  lstatSync: emptyFsErrorSync,
  mkdirSync: emptyFsErrorSync,
  readdirSync: emptyFsErrorSync,
  readFileSync: emptyFsErrorSync,
  realpathSync: emptyFsErrorSync,
  statSync: emptyFsErrorSync,
  watch: emptyFsErrorSync,
  writeFile: emptyFsError
};

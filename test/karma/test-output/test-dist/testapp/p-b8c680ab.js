var t = 0;

function hello() {
  return "hello" + ++t;
}

var e = 0;

async function getResult() {
  const t = (await __sc_import_testapp("./p-f99988aa.js")).concat;
  return e++, t(hello(), "world") + e;
}

export { getResult }
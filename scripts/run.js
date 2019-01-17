
process.on(`unhandledRejection`, (e) => {
  console.error(e.toString());
  process.exit(1);
});

module.exports = async function run(cb) {
  try {
    await cb();
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

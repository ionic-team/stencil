
process.on(`unhandledRejection`, (e) => {
  if (e) {
    console.error(e.toString());
  }
  process.exit(1);
});


module.exports = async function run(cb) {
  try {
    await cb();

  } catch (e) {
    if (e && e.message) {
      const msg = e.message.toString().trim();
      if (msg.length > 0) {
        console.error(msg);
      }
    }
    process.exit(1);
  }
}

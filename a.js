const { renderToString } = require('./test/end-to-end/hydrate/index.js');

(async () => {
  let now = Date.now();
  const { html } = await renderToString(
    `<another-car-detail></another-car-detail>`,
    // `<div><template>Hello</template></div>`,
    {
      fullDocument: true,
      prettyHtml: true,
      serializeShadowRoot: true,
    },
  );
  console.log(html);
  console.log(Date.now() - now);
})();

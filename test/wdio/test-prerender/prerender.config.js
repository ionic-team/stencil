module.exports = {
  beforeHydrate(doc) {
    doc.documentElement.setAttribute('dir', 'ltr');
  },

  afterHydrate(doc, url) {
    doc.title = `Url: ${url.href}`;
  },

  filterUrl() {
    return true;
  },

  hydrateOptions() {
    const hydrate = {
      prettyHtml: true,
    };
    return hydrate;
  },
};

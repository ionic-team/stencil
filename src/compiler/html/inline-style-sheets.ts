import * as d from '../../declarations';


export function inlineStyleSheets(config: d.Config, compilerCtx: d.CompilerCtx, doc: Document, maxSize: number, outputTarget: d.OutputTargetWww) {
  const globalLinks = Array.from(doc.querySelectorAll('link[rel=stylesheet]')) as HTMLLinkElement[];
  return Promise.all(
    globalLinks.map(async link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('/') || link.getAttribute('media') !== null) {
        return;
      }
      const fsPath = config.sys.path.join(outputTarget.dir, href);
      if (!await compilerCtx.fs.access(fsPath)) {
        return;
      }
      const styles = await compilerCtx.fs.readFile(fsPath);
      if (styles.length > maxSize) {
        return;
      }

      // insert inline <style>
      const inlinedStyles = doc.createElement('style');
      inlinedStyles.innerHTML = styles;
      link.parentNode.insertBefore(inlinedStyles, link);
      link.remove();
    })
  );
}

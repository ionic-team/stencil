- remove queue if not updatable
- use getRoot() instead of while(parentNode)
- remove Built with Stencil from components
- gather jsx, class, style, attributes data
- remove attribute code from h()
- reduce setAccessor() and patch()
- detect if functional components used and remove
- if build conditional undefined then it's true
- property rename vnode props if no functional component


- no dynamic import option, inline esm import instead
- no closure for esm
- global esm bundling updates
- remove resourceUrl
- window.performance as an import


- remove domApi
- remove loader
- remove prototype.componentOnReady()
- dynamic import polyfill for esm that doesn't dynamic import
- research template element is in-memory and not in the dom
- why do true/false conditonal values still exist in dev/debug
- use internal class instead of serveral weakmaps

# StencilJS Size Analysis


## Bundle size of 1 component without library bundled

This is the cost to expect for every new my-counter-like component added to the same page. The library is not included.

| File            | Minified/Gzipped |
|---------------------|------|
| my-counter.entry.js | __<!--COMPONENT-->345<!--/COMPONENT-->b__ |


## Bundle size of 1 component with library bundled

If you only deliver a single Web Component you have the full cost of the library for a single component. This is the total cost of a single component with the library included.

| Description | Minified/Gzipped  |
|-------------|-------|
| Library     | <!--LIBRARY-->3246<!--/LIBRARY-->b |
| Component   | <!--COMPONENT-->345<!--/COMPONENT-->b  |
| __Total__   | __<!--LIBRARY_COMPONENT-->3591<!--/LIBRARY_COMPONENT-->b__ |


## Estimated Bundle size of the library at runtime

* Identical to "Bundle size of 1 component with library bundled"


## Estimated Bundle size of 30 components using the same library

This is an estimated size of a bundle of 30 my-counter-like components using the same library. All components will share the library code so the estimated size is calculated with: 1 bundle-with-dependencies + 29x bundles-without-dependencies.

| Description   | Minified/Gzipped   |
|---------------|--------|
| Library       | <!--LIBRARY-->3246<!--/LIBRARY-->b  |
| 30 Components | <!--COMPONENT_30-->10350<!--/COMPONENT_30-->b |
| __Total__     | __<!--LIBRARY_COMPONENT_30-->13596<!--/LIBRARY_COMPONENT_30-->b__ |

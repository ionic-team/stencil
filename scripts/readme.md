# Local Build and Testing

1. `npm run build`
2. From the root of this local @stencil/core repo, run `npm link @stencil/core`
3. From the root of a local stencil app, run `npm link @stencil/core`
4. Every time you run `npm run build` your linked projects will have to restart.
5. Test test test. Add unit tests for any updates and always run `npm run test` or `npm run test.watch`.


# Deploy

1. `npm run prepare.deploy`
2. Check the changelog and make sure it is good, then commit the changes.
3. `npm run deploy`

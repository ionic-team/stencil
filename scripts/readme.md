# Manually Testing Stencil's Browser API

Stencil's Browser API should be checked manually prior to a release. There are plans to get programmatic testing in
place in the future.

1. Build Stencil from the root of this repo: `npm run ci && npm run build.prod`
2. `cd test/browser-compile`
3. Start the application: `npm start`
4. Validate the output is properly transpiled

# Release

1. `npm run release.prepare`
2. Check the [CHANGELOG.md](../CHANGELOG.md) and make sure it includes all the changes that have landed since the last 
release.
3. Commit the changes - use the commit message :emoji: v<VERSION>. e.g. :star2: v2.7.0 
4. `npm run release`
5. Publish the release notes in GitHub
6. Navigate to the [Stencil Site](https://github.com/ionic-team/stencil-site/pulls) repository and merge and PRs 
   containing documentation that has been approved, but not merged that is related to the release. Such PRs should be
   labelled as `do not merge: waiting for next stencil release`. It's a good idea to review _all_ PRs though, just in
   case :wink:
7. :tada:

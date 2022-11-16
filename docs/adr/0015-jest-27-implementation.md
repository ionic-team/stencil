# 0015. jest 27 implementation

Date: 2021.12.16

## Status

historical

## Context

In 2021.Q2, the team decided to perform a more comprehensive evaluation of the Jest 27 upgrade & split the effort into
multiple user stories (see [ADR-0004](./0004-jest-27-support.md)). This document explains various design decisions that
were accounted for as a part of the upgrade itself.

## Decisions Made

### Jest was Upgraded Internally before Exposing Functionality to End Users

Stencil's Jest infrastructure is configured such that the compiler uses the same base Jest configuration as consumers
of Stencil's testing functionality. This coupling allows for the compiler to test the base configuration while running
its own unit tests. A consequence of this design is that upgrade Jest requires either doing the upgrade in such a way
that affects the core team and end users (all at once), or splitting up the work (where the internal upgrade occurs
first). Due to the number of breaking changes in Jest 27, we opted for the latter in order to work more carefully and
ensure we understood the infrastructure as a whole.

The work to add Jest support internally was completed in [#3171](https://github.com/ionic-team/stencil/pull/3171). 

#### Use `jest-jasmine2` as the Test Runner

One of the more impactful changes that Jest 27 introduces is moving away from a Jasmine-based test runner 
(`jest-jasmine2`) in favor of `jest-circus`. Stencil's existing infrastructure around environment set up assumes a
Jasmine-based environment. Swapping out the environment type would expand the scope of the upgrade and potentially be a
further breaking change for consumers. As a result, we opted to continue to use `jest-jasmine`, with an eye to moving
`jest-circus` at a later date.

#### Backwards Compatability for Earlier Versions of Jest in Preprocessor

Stencil comes with a standard preprocessor for Jest that transforms non-CommonJS-based files (that are not written in
JavaScript). Between Jest versions 23 (when the preprocessor was written) and version 27, the function signatures of
two important functions have changed:

1. `process()` - performs the transformation of files when running Jest tests
2. `getCacheKey()` - generates a cache key for each file transformed by `process()`, and is used to prevent unnecessary
transformations of files that have not changed between runs of Jest.

Care was taken to allow for a high degree of backwards compatability between versions 24 (the current minimum supported
version) and version 27 of Jest. This led to the creation of boilerplate type checking code. To minimize maintenance of
these checks, they will be eliminated in a future major release of Stencil, when the minimum supported version of Jest
is incremented to v27.

However, Stencil's cache naming strategy did still have to change in order to ensure a positive user experience. The
result of changing the naming strategy is that existing caches on a user's machine will be stale until tests are run
for the first time using the version of Stencil v2.12.0 (which includes this support). After the first run of tests,
the cache should be properly populated.

#### Temporarily Disable Certain Tests in Continuous Integration Runs

Stencil's end-to-end testing suite uses the version of Jest that is installed at the root of the project, as if it were
the version of Jest that an end user had installed themselves. This was a problematic aspect of the migration in that
the separation of work assumed that the first half wouldn't break existing tests (which it did, as support for Stencil
consumers to use Jest 27 had not yet been implemented). Although this broke tests, it did not break Stencil itself. To
work around this issue, the end-to-end tests were temporarily disabled, and re-enabled in the follow-up PR for adding
Jest 27 support for end users

### User Facing Decisions Made

The work to add Jest support for end users was completed in [#3189](https://github.com/ionic-team/stencil/pull/3189).

#### Legacy Jest Options

One of the largest indicators of users wanting to use Jest 27 came in the form of GitHub issues, Slack questions, and
the like with the following error message after upgrading to Jest 27 (before support was implemented): 

> Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './build/cli/args' is not defined by "exports" in ../node_modules/jext-cli/package.json

The reason for this error message is the Jest team decided to encapsulate `'./build/cli/args.js'` using the `exports`
keyword in the `jest-cli` subpackage as a part of the Jest 27 release. This prevents the Node runtime from importing
the file by design. This posed a problem, as said file was used to generated a series of arguments to be provided to
Jest when tests were run.

When evaluating the behavior of how Stencil used this file with Jest versions 24 through 26, it was realized that
`args.js` (that is no longer available in v27) was used to generate the same arguments under all three versions of
Jest. Given that this list is small, the team has decided to extract it into the Stencil codebase rather than
dynamically generate it.

Like any other static list, there is the chance of the one added to the codebase to grow stale. To help prevent this,
the team intends to remove this list when Jest 27 is the minimum version of the library supported by Stencil.

Alternatively, the team could have taken the route of attempting to circumvent this encapsulation (and did in fact 
prototype this), but ultimately decided against it for two reasons:
1. The Jest team has been explicit about the contract between consumers of `jest-cli` and the package itself, and the
Stencil team should honor it
2. The Jest team would be fully within their right to move the `args.js` file in _any_ release of Jest moving forward,
which would break Stencil testing support

#### `@types/jest` Continued to be Used

Jest is (largely) written in TypeScript. When a library migrates from JavaScript to TypeScript, that type migration can
be a signal to move to the typings provided by the library instead of those provided by the Definitely Typed community.
For this effort, the team has decided to continue to use `@types/jest` rather than attempt to use any typings provided
by Jest itself. The reason for this decision is to align ourselves with the guidance provided by Jest on using
Jest with TypeScript. As of v27.4 of Jest, the current guidance is:

> You may also want to install the @types/jest module for the version of Jest you're using. This will help provide full
> typing when writing your tests with TypeScript.

Should this advice change the Stencil team shall revisit this decision.

### Future Work

#### "Which Versions of Jest does Stencil Support?"

Stencil does not make it clear in its documentation which versions of Jest are supported. The team shall take efforts
to clarify the versions of Jest that are currently supported.

## Links

- [ADR-0004-jest-27-support](./0004-jest-27-support.md)
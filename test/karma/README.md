# Karma Testing

Karma can be used to test final rendered output on various browsers and operating systems. Use this process to recreate
issues and test/fix them within browsers. Tests are then locked-in and re-validated with 
[BrowserStack](https://www.browserstack.com/) on every Github commit against the browsers which Stencil supports
(ie11+).

To run any tests in this directory, minor setup is required:
1. `cd` to `test/karma` (this directory)
2. `npm install`

### Sub-directories

The Karma testing directory contains three child directories used in Stencil's Karma tests. Each of these directories
have an associated build script in the `package.json` file that sits adjacent to this README, prefixed with `build.*`,
used to build a test application prior to tests being run against it (e.g. `build.app`).

### `test-app/`

`test-app/` is used to house tests that target running a Stencil component/functionality in the context of a web 
application. The immediate child directories group one or more tests for the purpose of testing a specific piece of
functionality. 

A directory containing a test will typically consist of at least three files:
1. `cmp.tsx` - a file containing a Stencil component under test
2. `index.html` - the application that consumes the Stencil component found in `cmp.tsx`
3. `karma.spec.ts` - contains the test(s) themselves

This list however, is not prescriptive to the point of being constraining in the ability to write tests. Additional
files may be added/removed as needed in order to create an effective test.

### `test-prerender/`

`test-prerender/` is used to test and verify that pre-render builds are able to run to completion. The components used 
in this directory are consumed by tests found in the `test-app/` directory.

### `test-sibling/`

`test-sibling/` is used to verify that more than one instance of Stencil can run in the context of an application. The
components used in this directory are consumed by tests found in the `test-app/` directory.


### Creating a New Test

First, create a replication page for your tests:

1. Create a directory at the root of `test/karma/test-app` 
   1. It may be easiest to just copy an existing test directory
2. `npm start` will fire up a normal Stencil dev-server and browser.
3. In the browser, navigate to your new test, and build it out to recreate an issue.
4. Keep it simple and focused on one thing.

Next, create the Karma test:

1. In the test directory that was created, create a `karma.spec.ts`.
2. Review how other tests render and update using `setupDomTests` and `flush`.
3. `npm run karma.prod` will run all the tests.
4. Thanks!

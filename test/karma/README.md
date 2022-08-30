# Karma Testing

Karma can be used to test final rendered output on various browsers and operating systems.
Use this process to recreate issues and test/fix them within browsers.
Tests are then locked-in and re-validated with [BrowserStack](https://www.browserstack.com/).

To run any tests in this directory, minor setup is required:
1. `cd` to `test/karma` (this directory)
2. `npm install`

## Environments

The tests in this directory can be run three different ways:
1. Locally using Chrome
2. Through a local tunnel to Browserstack
3. In a continuous integration (CI) environment

### Running Entirely Locally

Running the tests in a local environment is the quickest way to receive feedback as a part of daily development.
Tests are run against pre-compiled applications in this directory, but the tests themselves are compiled when a test 
command is invoked.
This allows for developers to quickly iterate on tests, while still targeting applications built with Stencil. 

To build all applications used for testing and to run all tests from this directory:
```
npm run karma.prod
```
Alternatively, if one does not need to rebuild the applications (e.g. only tests were modified), from this directory:
```
npm run karma
```

By default, locally running tests will start a headless Chrome instance and run the tests against that instance.
For additional browsers to test against, please see the [Tunnelling into BrowserStack](#tunnelling-into-browserstack) section.

### Tunnelling into Browserstack

Stencil engineers can run the Karma tests by tunnelling into Browserstack.
Doing so will allow one to target the same browsers that the project targets in CI.
However, developers should note that tunnelling into Browserstack will count against the team's allotment of running no
more than five parallel tests at once.
This can delay Karma tests running in a CI environment, and affect the time it takes to land a pull request.

To tunnel into Browserstack, an access key and username are required.
These can be accessed through the [Browserstack Dashboard](https://automate.browserstack.com/dashboard/v2).
At this time, only members of the Stencil core team are granted access keys/usernames.
If you are a member of the Stencil team and do not have access to Browserstack, please see the team lead.

Once an access key and username have been acquired, tunneling into Browserstack requires invoking the tests with the
following environment variables:
- `LOCAL_BROWSERSTACK=1` tells the test runner to tunnel into Browserstack from your local machine
- `BROWSERSTACK_ACCESS_KEY=[KEY]` provides your personal access key to Browserstack for authentication purposes
- `BROWSERSTACK_USERNAME=USERNAMEKEY]` provides your personal uesr name to Browserstack for authentication purposes

To build all applications used for testing and to run all tests from this directory:
```
LOCAL_BROWSERSTACK=1 BROWSERSTACK_ACCESS_KEY=[KEY] BROWSERSTACK_USERNAME=[USERNAME] npm run karma.prod
```
Alternatively, if one does not need to rebuild the applications (e.g. only tests were modified), from this directory:
```
LOCAL_BROWSERSTACK=1 BROWSERSTACK_ACCESS_KEY=[KEY] BROWSERSTACK_USERNAME=[USERNAME] npm run karma
```

*Note that the command above will save your credentials to your shell's history.*
It is _highly_ recommended that developers look into alternatives to protect their access keys!

### Continuous Integration (CI)

These Karma tests run in a CI environment.
In order for the CI job that runs the tests to communicate with Browserstack, environment-specific fields need to be set.
This is controlled by the `CI` environment variable.
This method of running the Karma tests is not designed to be run locally.
If targeting multiple browsers, see the [Tunnelling into BrowserStack](#tunnelling-into-browserstack) section.

## Sub-directories

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

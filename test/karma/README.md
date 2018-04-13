# Karma Testing

Used to test final rendered output within various browsers. Using this process to recreate issues and test/fix them within browsers, then locking in the tests to be re-validated on every build which browsers stencil supports.

1. `cd` to `test/karma`
2. `npm install`


### Create a test page

1. Create a directory at the root of `test/karma/src` (easiest to just copy an existing test)
2. `npm run dev` will fire up a normal stencil server and browser.
3. In the browser, navigate to your new test, and build it out to recreate an issue.
4. Keep it simple and focused on one thing.


### Create a karma test

1. In the test directory, create `karma.spec.ts`.
2. Review how other tests render and update using `setupDomTests`
3. `npm run karma.prod` will run all the tests.

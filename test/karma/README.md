# Karma Testing

Karma can be used to test final rendered output on various browsers and operating systems. Use this process to recreate issues and test/fix them within browsers. Tests are then locked-in and re-validated with [BrowserStack](https://www.browserstack.com/) on every Github commit against the browsers which Stencil supports (ie11+).

1. `cd` to `test/karma`
2. `npm install`


### Create a test page

1. Create a directory at the root of `test/karma/test-app` (easiest to just copy an existing test directory)
2. `npm run dev` will fire up a normal Stencil server and browser.
3. In the browser, navigate to your new test, and build it out to recreate an issue.
4. Keep it simple and focused on one thing.


### Create a karma test

1. In the test directory, create `karma.spec.ts`.
2. Review how other tests render and update using `setupDomTests` and `flush`.
3. `npm run karma.prod` will run all the tests.
4. Thanks!

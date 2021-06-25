# Contributing

Thanks for your interest in contributing to Stencil! :tada:


## Contributing Etiquette

Please see our [Contributor Code of Conduct](https://github.com/ionic-team/stencil/blob/master/CODE_OF_CONDUCT.md) for information on our rules of conduct.


## Creating an Issue

* If you have a question about using Stencil, please ask in the [Stencil Worldwide Slack](https://stencil-worldwide.herokuapp.com/) group.

* It is required that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

* The issue list of this repository is exclusively for bug reports and feature requests. Non-conforming issues will be closed immediately.

* Issues with no clear steps to reproduce will not be triaged. If an issue is labeled with "needs reply" and receives no further replies from the author of the issue for more than 5 days, it will be closed.

* If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported](https://github.com/ionic-team/stencil/issues?utf8=%E2%9C%93&q=is%3Aissue). You can search through existing issues to see if there is a similar one reported. Include closed issues as it may have been closed with a solution.

* Next, [create a new issue](https://github.com/ionic-team/stencil/issues/new) that thoroughly explains the problem. Please fill out the populated issue form before submitting the issue.


## Creating a Pull Request

* We appreciate you taking the time to contribute! Before submitting a pull request, we ask that you please [create an issue](#creating-an-issue) that explains the bug or feature request and let us know that you plan on creating a pull request for it. If an issue already exists, please comment on that issue letting us know you would like to submit a pull request for it. This helps us to keep track of the pull request and make sure there isn't duplicated effort.

* Looking for an issue to fix? Make sure to look through our issues with the [help wanted](https://github.com/ionic-team/stencil/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) label!

### Setup

1. Fork the repo.
2. Clone your fork.
3. Make a branch for your change.
4. Run `npm install` (make sure you have [node](https://nodejs.org/en/) and [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) installed first)


#### Updates

1. Unit test. Unit test. Unit test. Please take a look at how other unit tests are written, and you can't write too many tests.
2. If there is a `*.spec.ts` file located in the `test/` folder, update it to include a test for your change, if needed. If this file doesn't exist, please notify us.
3. First run `npm run build`. Then run `npm run test` or `npm run test.watch` to make sure all tests are working, regardless if a test was added.

#### Testing Changes Against a Project Locally

##### Testing with `npm link`:

Using `npm link` is beneficial to the development cycle in that consecutive builds of Stencil are immediately available in your project, without any additional `npm install` steps needed:

1. In the directory of _stencil core_:
    1. Run `npm run build`
    2. Run `npm link`
2. In the directory of _your stencil project_:
    1. Run `npm link @stencil/core`
    2. Add the following to your `tsconfig.json`, to ensures that typescript can resolve all modules correctly:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@stencil/core/internal": ["node_modules/@stencil/core/internal"],
      "@stencil/core/internal/*": ["node_modules/@stencil/core/internal/*"]
    }
  }
}
```

You can then test your changes against your own stencil project.

Afterwards, to clean up:

1. In the directory of _your stencil project_:
    1. Run `npm unlink @stencil/core`
    2. Remove the modifications to your tsconfig.json
2. In the directory of _stencil core_, run `npm unlink`

##### Testing with `npm pack`:

There are some cases where `npm link` may fall short. For instance, when upgrading a minimum/recommended package version where the package in question has changed its typings. Rather than updating `paths` in your project's `tsconfig.json` file, it may be easier to create a tarball of the project and install in manually.

1. In the directory of _stencil core_:
    1. Run `npm run build`
    2. Run `npm pack`. This will create a tarball with the name `stencil-core-<VERSION>.tgz`
2. In the directory of _your stencil project_:
    1. Run `npm install --save-dev <PATH_TO_STENCIL_REPO_ON_DISK>/stencil-core-<VERSION>.tgz`. 
       * e.g. If you cloned the stencil repo to `~/workspaces` and built v.2.6.0, you would run `npm install ~/workspaces/stencil/stencil-2.6.0.tgz`
  
Note that this method of testing is far more laborious than using `npm link`, and requires every step to be repeated following a change to the Stencil core source.

Afterwards, to clean up:

1. In the directory of your stencil project, run `npm install --save-dev stencil@<VERSION>` for the `<VERSION>` of Stencil core that was installed in your project prior to testing. 

## Commit Message Format

We have very precise rules over how our git commit messages should be formatted. This leads to readable messages that are easy to follow when looking through the project history. We also use the git commit messages to generate our changelog. (Ok you got us, it's basically Angular's commit message format).

`type(scope): subject`

#### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope
The scope can be anything specifying place of the commit change. For example `renderer`, `compiler`, etc.

#### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* do not capitalize first letter
* do not place a period `.` at the end
* entire length of the commit message must not go over 50 characters
* describe what the commit does, not what issue it relates to or fixes
* **be brief, yet descriptive** - we should have a good understanding of what the commit does by reading the subject


#### Adding Documentation

Please see the [stencil-site](https://github.com/ionic-team/stencil-site) repo to update documentation.


## License

By contributing your code to the ionic-team/stencil GitHub Repository, you agree to license your contribution under the MIT license.

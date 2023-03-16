# Prerequisite - Manually Test Stencil's Browser API

Stencil's Browser API should be checked manually prior to a release.
There are plans to remove this feature in the future, which will eliminate the need for this step

1. Build Stencil from the root of this repo: `npm run ci && npm run build`
2. `cd test/browser-compile`
3. Start the application: `npm start`
4. Validate the output is properly transpiled

# Release

Stencil can either be released by CI/CD (via GitHub Actions), or manually.
An automated release is the preferred way of creating a new release of the project.
Manual releases should only be performed when there are extenuating circumstances preventing an automated release.

## Automated Release

1. Run the [Stencil Production Release](https://github.com/ionic-team/stencil/actions/workflows/release-production.yml) in GitHub
   1. _Always_ run the workflow from the `main` branch
   2. Stencil follows semantic versioning. Select the semver-appropriate version from the dropdown for this release
   3. Stencil should be published under the `latest` tag
2. Proceed to the [Follow-Up section](#follow-up) of this document to run manual follow-up tasks

## Manual Release

:warning: Manual releases should only be performed when there are extenuating circumstances that prevent an automated one from occurring :warning:

1. `npm run release.prepare`
2. Check the [CHANGELOG.md](../CHANGELOG.md) and make sure it includes all the changes that have landed since the last 
release.
3. Commit the changes - use the commit message ':emoji: v<VERSION>'. e.g. `git commit -m '🤦‍ v2.7.0'`
4. Push the changes - `git push origin`
5. `npm run release`

# Follow-Up
1. Publish the release notes in GitHub
2. Navigate to the [Stencil Site](https://github.com/ionic-team/stencil-site/pulls) repository and merge and PRs
   containing documentation that has been approved, but not merged that is related to the release. Such PRs should be
   labelled as `do not merge: waiting for next stencil release`. It's a good idea to review _all_ PRs though, just in
   case :wink:
3. If there are any 'next' branches in GitHub, say for a future major version of Stencil (e.g. `v4.0.0-dev`), now is a
   good time to sync them with the `main` branch.
4. Perform the following tasks in JIRA:
   1. Mark this version of Stencil as 'released' in JIRA
   2. Move the task card in this current sprint to the 'Done' swimlane
   3. Stub out the next release and task for the release in JIRA
5. Ensure all GitHub Issues associated with stories/tasks that shipped in this version of Stencil are closed

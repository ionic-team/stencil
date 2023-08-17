# Releasing Stencil

Stencil can either be released by CI/CD (via GitHub Actions), or manually.
An automated release is the preferred way of creating a new release of the project.
Manual releases should only be performed when there are extenuating circumstances preventing an automated release.

## Automated Releases

⚠️ Do not run this workflow at this time ⚠️

⚠️ It is currently not in a working state ⚠️

1. Call a `code-freeze` in the Stencil team channel
1. Check that [Stencil's Merge
   Queue](https://github.com/ionic-team/stencil/queue/) is empty (nothing is
   queued for merge).
1. Run the [Stencil Production Release PR Creation Workflow](https://github.com/ionic-team/stencil/actions/workflows/create-production-pr.yml)
   in GitHub
    1. Run the workflow from the `main` branch, _unless_ the release is for a previous major version of Stencil.
       In that scenario, select the `v#-maintenance` branch corresponding to the version of Stencil being released.
       For example, `v3-maintenance` to release a new version of Stencil v3.
    1. Stencil follows semantic versioning. Select the appropriate version from the dropdown for this release.
    1. Hit "Run Workflow" and wait for a new pull request to be created.
1. Open the pull request that was opened as a result of running the Stencil Production Release PR Creation Workflow.
1. Complete the following (temporary) steps:
    1. Close the pull request and reopen it. This allows actions that the team gates pull requests on to run.
    1. Mark the pull request as ready for review.
1. Ask the Stencil team for an approval on the PR
1. Once approved, add it to the merge queue.
1. ⚠️ Wait for the pull request to land before continuing to the next step. ⚠️
1. Run the [Stencil Production Release Workflow](https://github.com/ionic-team/stencil/actions/workflows/release-production.yml)
    1. Stencil should be published under the `latest` tag, _unless_ the release is for a previous major version of
     Stencil.
    1. The base branch should be set to `main`, _unless_ the release is for a previous major version of Stencil.
    1. Tail the logs to verify everything runs successfully.
1. Proceed to the [Follow-Up section](#follow-up-steps) of this document to run manual follow-up tasks.

## Manual Releases

⚠️ Manual releases should only be performed when there are extenuating circumstances that prevent an automated one from occurring ⚠️

✍️ Authoring permissions are needed for an individual to perform a manual release. If needed, please ping Ionic leadership. ✍️

1. Call a `code-freeze` in the Stencil team channel
1. Run `npm run clean` locally to clear out any cached build artifacts.
1. Run `npm run release.prepare`. This will install dependencies, bundle Stencil, run tests, etc.
1. Check the [CHANGELOG.md](../CHANGELOG.md) and make sure it includes all the changes that have landed since the last 
release.
1. Commit the changes - use the commit message '<emoji> v<VERSION>'. e.g. `git commit -m '🤦‍ v2.7.0'` (note the emoji is 
used literally, as opposed to ':facepalm:').
1. Run `npm run release`, which will push the commit/tag to GitHub and publish to NPM.
1. Proceed to the [Follow-Up section](#follow-up-steps) of this document to run manual follow-up tasks.

# Follow-Up Steps

The following steps should be always run, regardless of whether an automated or
manual release was performed.

1. Publish the release notes in GitHub using GitHub's [release notes form](https://github.com/ionic-team/stencil/releases/new).
   1. If anyone from the community contributed commit(s) to this release,
      append the following to the end of the GitHub release notes:

      ```md
      ## Thanks

      🎉 Thanks <GitHub_Usernames> for their contributions! 🎉
      ```
1. Navigate to the [Stencil Site](https://github.com/ionic-team/stencil-site/pulls) repository and merge PRs
   containing documentation that has been approved, but not merged that is related to the release. Such PRs should be
   labelled as `do not merge: waiting for next stencil release`. It's a good idea to review _all_ PRs though, just in
   case.
1. If there are any 'next' branches in GitHub, say for a future major version of Stencil (e.g. `v5.0.0-dev`), now is a
   good time to rebase them against the `main` branch.
1. Perform the following tasks in JIRA:
   1. Mark this version of Stencil as 'released' in JIRA on the 'Releases' page.
   1. Move the task card in this current sprint to the 'Done' swim-lane.
   1. Stub out the next release and task for the release in JIRA.
1. Ensure all GitHub Issues associated with stories/tasks that shipped in this version of Stencil are closed.
   1. For each issue, add a comment stating the version of Stencil that
      included the fix/feature (be sure to update the version number _and_
      tag):
      
      ```md
      The fix for this issue has been released as a part of today's [Stencil
      vNUMBER release](https://github.com/ionic-team/stencil/releases/tag/TAG). 
      ```
1. Let folks in Ionic know about the release in the #whathappened Slack channel
   with a link to the changelog.
   1. Let the CS team know by 'at-ing' them  about any enterprise reported issues or feature requests that were included in the release in a thread on your #whathappened post. Jira
      tickets related to enterprise requests should be marked with the "jira_escalated" label and/or the "Enterprise Support"
      or "Enterprise Feature Requests" epic.
1. End the code freeze in the Stencil team Slack channel.
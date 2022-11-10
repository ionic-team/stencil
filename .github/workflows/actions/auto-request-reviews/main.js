const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);

  const organization = core.getInput('org');
  const teamSlug = core.getInput('team');

  // PR author
  const username = github.context.payload.pull_request.user.login;

  // Check if the PR author is a member of the organization
  const { status } = await octokit.rest.orgs.checkMembershipForUser({
    org: organization,
    username,
  });

  // 204 means that both the requester (the action's authorization) and the PR author
  // are org members, so we should assign the PR to team members accordingly
  if (status === 204) {
    const { data: stencilTeamMembers } = await octokit.rest.teams.listMembersInOrg({
      org: organization,
      // Adding the team will only return the members in the org
      // that are in the team
      team_slug: teamSlug,
    });

    const reviewers = stencilTeamMembers.filter((ref) => ref.login !== username).map((ref) => ref.login);

    await octokit.rest.pulls.requestReviewers({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.number,
      reviewers,
    });
  }
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}

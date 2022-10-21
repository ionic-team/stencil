const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);

  const organization = core.getInput('org');
  const teamSlug = core.getInput('team');

  let teamReviewers = [];
  let reviewers = [];

  console.log('PAYLOAD', github.context.payload);

  // PR author
  const username = github.context.payload.pull_request.payload.user.login;

  // Determine if the author is an organization member
  const isInternalMember = await octokit.rest.teams.getMembershipForUserInOrg({
    org: organization,
    username,
  });

  // If the user is a member of the org, we will directly assign the members of the Stencil team
  // Otherwise, we will assign the team itself as a reviewer
  if (!!isInternalMember && isInternalMember.data.state === 'active') {
    const stencilTeamMembers = await octokit.rest.teams.listMembersInOrg({
      org: organization,
      // Adding the team will only return the members in the org
      // that are in the team
      team_slug: teamSlug,
    });
    reviewers = stencilTeamMembers.filter((ref) => ref.login !== username);
  } else {
    teamReviewers = [teamSlug];
  }

  // Assign reviewers
  await octokit.rest.pulls.requestReviewers({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
    team_reviewers: teamReviewers,
    reviewers,
  });
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}

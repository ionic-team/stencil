const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);

  const organization = core.getInput('org');

  // PR author
  const username = github.context.payload.pull_request.user.login;

  const { data } = await octokit.rest.orgs.getMembershipForUser({
    org: organization,
  });

  console.log('USERS', data);

  const member = data.find((member) => member.login === username);

  console.log('member', member);

  // If the user is a member of the org, we will directly assign the members of the Stencil team
  // Otherwise, we will assign the team itself as a reviewer
  if (member != null) {
    const stencilTeamMembers = await octokit.rest.teams.listMembersInOrg({
      org: organization,
      // Adding the team will only return the members in the org
      // that are in the team
      team_slug: teamSlug,
    });
    console.log('STENCIL MEMBERS', stencilTeamMembers);
    const reviewers = stencilTeamMembers.filter((ref) => ref.login !== username);

    // Assign reviewers
    await octokit.rest.pulls.requestReviewers({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: github.context.payload.number,
      team_reviewers: teamReviewers,
      reviewers,
    });
  }
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}

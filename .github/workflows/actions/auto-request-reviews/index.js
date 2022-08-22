import * as core from '@actions/core';
import * as github from '@actions/github';

const ORG = 'ionic-team';
const STENCIL_TEAM_SLUG = 'stencil';

try {
  core.get;
  const token = core.getInput('token');
  const octokit = github.getOctokit(token);

  let teamReviewers = [];
  let reviewers = [];

  // PR author
  const username = github.context.payload.pull_request.payload.user.login;

  // Determine if the author is an organization member
  const isInternalMember = await octokit.rest.teams.getMembershipForUserInOrg({
    org: ORG,
    username,
  });

  // If the user is a member of the org, we will directly assign the members of the Stencil team
  // Otherwise, we will assign the team itself as a reviewer
  if (!!isInternalMember && isInternalMember.data.state === 'active') {
    const stencilTeamMembers = await octokit.rest.teams.listMembersInOrg({
      org: ORG,
      // Adding the team will only return the members in the org
      // that are in the team
      team_slug: STENCIL_TEAM_SLUG,
    });
    reviewers = stencilTeamMembers.filter((ref) => ref.login !== username);
  } else {
    teamReviewers = [STENCIL_TEAM_SLUG];
  }

  // Assign reviewers
  await octokit.rest.pulls.requestReviewers({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    pull_number: github.context.payload.pull_request.number,
    team_reviewers: teamReviewers,
    reviewers,
  });
} catch (error) {
  core.setFailed(error.message);
}

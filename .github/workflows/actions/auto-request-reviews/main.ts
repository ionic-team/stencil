import { getInput, setFailed } from '@actions/core';
import { context, getOctokit } from '@actions/github';

async function run() {
  const writeToken = getInput('writeToken');
  if (writeToken == null || !writeToken.length) {
    throw new Error('No Github write token provided');
  }

  const readToken = getInput('orgReadToken');
  if (readToken == null || !readToken.length) {
    throw new Error('No Github read token provided');
  }

  const organization = getInput('org');
  if (organization == null || !organization.length) {
    throw new Error('No Github organization specified');
  }

  const teamSlug = getInput('team');
  if (teamSlug == null || !teamSlug.length) {
    throw new Error('No Github team specified');
  }

  const writeOctokit = getOctokit(writeToken);
  const readOctokit = getOctokit(readToken);

  // PR author
  const username = context.payload.pull_request?.user.login as string;

  // Check if the PR author is a member of the organization
  const { status } = await readOctokit.rest.orgs.checkMembershipForUser({
    org: organization,
    username,
  });

  // 204 means that both the requester (the action's authorization) and the PR author
  // are org members, so we should assign the PR to team members accordingly
  // Need to cast to a number because the octokit type generics assume this will only return a 302 which is not true
  if ((status as number) === 204) {
    const { data: teamMembers } = await readOctokit.rest.teams.listMembersInOrg({
      org: organization,
      // Adding the team will only return the members in the org
      // that are also in the team
      team_slug: teamSlug,
    });

    const reviewers = teamMembers.filter((ref) => ref.login !== username).map((ref) => ref.login);

    await writeOctokit.rest.pulls.requestReviewers({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.number,
      reviewers,
    });
  }
}

run().catch((error) => {
  console.error(error);
  setFailed(error.message);
});

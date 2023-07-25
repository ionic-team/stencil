import { determineAnsweredVersionToUse, PrepareReleasePromptAnswers } from '../release-prepare-prompts';

describe('determineAnsweredVersionToUse', () => {
  it.each<[PrepareReleasePromptAnswers, string]>([
    [{ version: '1.0.0', specifiedVersion: '2.0.0', confirm: true }, '1.0.0'],
    [{ version: '1.0.0', confirm: true }, '1.0.0'],
    [{ specifiedVersion: '2.0.0', confirm: true }, '2.0.0'],
    [{ version: '', specifiedVersion: '', confirm: true }, 'UNKNOWN'],
    [{ version: '', confirm: true }, 'UNKNOWN'],
    [{ specifiedVersion: '', confirm: true }, 'UNKNOWN'],
    [{ confirm: true }, 'UNKNOWN'],
  ])('%s returns "%s"', (answers, expected) => {
    expect(determineAnsweredVersionToUse(answers)).toBe(expected);
  });
});

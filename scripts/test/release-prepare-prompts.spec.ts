import {
  determineAnsweredTagToUse,
  determineAnsweredVersionToUse,
  PrepareReleasePromptAnswers,
  ReleasePromptAnswers,
} from '../release-prepare-prompts';

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

describe('determineAnsweredTagToUse', () => {
  it.each<[ReleasePromptAnswers, string]>([
    [{ tag: '1.0.0', specifiedTag: '2.0.0', confirm: true, otp: '' }, '1.0.0'],
    [{ tag: '1.0.0', confirm: true, otp: '' }, '1.0.0'],
    [{ specifiedTag: '2.0.0', confirm: true, otp: '' }, '2.0.0'],
    [{ tag: '', specifiedTag: '', confirm: true, otp: '' }, 'UNKNOWN'],
    [{ tag: '', confirm: true, otp: '' }, 'UNKNOWN'],
    [{ specifiedTag: '', confirm: true, otp: '' }, 'UNKNOWN'],
    [{ confirm: true, otp: '' }, 'UNKNOWN'],
  ])('%s returns "%s"', (answers, expected) => {
    expect(determineAnsweredTagToUse(answers)).toBe(expected);
  });
});

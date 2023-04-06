import { determineAnsweredTagToUse, ReleasePromptAnswers } from '../release-prompts';

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

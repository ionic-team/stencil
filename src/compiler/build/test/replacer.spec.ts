import { buildExpressionReplacer } from '../replacer';
import { Config } from '../../../declarations';


describe('buildExpressionReplacer', () => {

  it(`should replace multiple "process.env.NODE_ENV === 'development'" w/ true`, () => {
    const config: Config = { devMode: true };
    const input = `if (process.env.NODE_ENV === 'development') {}if (process.env.NODE_ENV === 'development') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}if (true) {}`);
  });

  it(`should replace "process.env.NODE_ENV === 'development'" w/ true`, () => {
    const config: Config = { devMode: true };
    const input = `if (process.env.NODE_ENV === 'development') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace "process.env.NODE_ENV === 'development'" w/ false`, () => {
    const config: Config = { devMode: false };
    const input = `if (process.env.NODE_ENV === 'development') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (false) {}`);
  });

  it(`should replace "process.env.NODE_ENV === 'production'" w/ false`, () => {
    const config: Config = { devMode: true };
    const input = `if (process.env.NODE_ENV === 'production') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (false) {}`);
  });

  it(`should replace "process.env.NODE_ENV === 'production'" w/ true`, () => {
    const config: Config = { devMode: false };
    const input = `if (process.env.NODE_ENV === 'production') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace "process.env.NODE_ENV == 'production'" w/ true`, () => {
    const config: Config = { devMode: false };
    const input = `if (process.env.NODE_ENV == 'production') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace "process.env.NODE_ENV   == 'production'" w/ true`, () => {
    const config: Config = { devMode: false };
    const input = `if (process.env.NODE_ENV == 'production') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace "process.env.NODE_ENV=='production'" w/ true`, () => {
    const config: Config = { devMode: false };
    const input = `if (process.env.NODE_ENV=='production') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace "process.env.NODE_ENV !== 'production'" w/ true`, () => {
    const config: Config = { devMode: true };
    const input = `if (process.env.NODE_ENV !== 'production') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace "process.env.NODE_ENV !== 'development'" w/ true`, () => {
    const config: Config = { devMode: false };
    const input = `if (process.env.NODE_ENV !== 'development') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace "process.env.NODE_ENV !== 'production'" w/ false`, () => {
    const config: Config = { devMode: false };
    const input = `if (process.env.NODE_ENV !== 'production') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (false) {}`);
  });

  it(`should replace "process.env.NODE_ENV !== 'development'" w/ false`, () => {
    const config: Config = { devMode: true };
    const input = `if (process.env.NODE_ENV !== 'development') {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (false) {}`);
  });

  it(`should replace w/ production double quotes`, () => {
    const config: Config = { devMode: false };
    const input = `if (process.env.NODE_ENV === "production") {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace w/ production single quotes`, () => {
    const config: Config = { devMode: true };
    const input = `if (process.env.NODE_ENV === "development") {}`;
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

  it(`should replace w/ production tick quotes`, () => {
    const config: Config = { devMode: true };
    const input = 'if (process.env.NODE_ENV === `development`) {}';
    const output = buildExpressionReplacer(config, input);
    expect(output).toBe(`if (true) {}`);
  });

});

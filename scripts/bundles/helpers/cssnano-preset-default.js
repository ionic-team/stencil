/**
 * @author Ben Briggs
 * @license MIT
 * @module cssnano:preset:default
 * @overview
 *
 * This default preset for cssnano only includes transforms that make no
 * assumptions about your CSS other than what is passed in. In previous
 * iterations of cssnano, assumptions were made about your CSS which caused
 * output to look different in certain use cases, but not others. These
 * transforms have been moved from the defaults to other presets, to make
 * this preset require only minimal configuration.
 */

// const cssDeclarationSorter = require('css-declaration-sorter');
const postcssDiscardComments = require('postcss-discard-comments');
const postcssReduceInitial = require('postcss-reduce-initial');
const postcssMinifyGradients = require('postcss-minify-gradients');
// const postcssSvgo = require('postcss-svgo');
const postcssReduceTransforms = require('postcss-reduce-transforms');
const postcssConvertValues = require('postcss-convert-values');
// const postcssCalc = require('postcss-calc');
const postcssColormin = require('postcss-colormin').default;
const postcssOrderedValues = require('postcss-ordered-values');
const postcssMinifySelectors = require('postcss-minify-selectors');
const postcssMinifyParams = require('postcss-minify-params');
// const postcssNormalizeCharset = require('postcss-normalize-charset');
const postcssMinifyFontValues = require('postcss-minify-font-values');
const postcssNormalizeUrl = require('postcss-normalize-url');
// const postcssMergeLonghand = require('postcss-merge-longhand');
const postcssDiscardDuplicates = require('postcss-discard-duplicates');
// const postcssDiscardOverridden = require('postcss-discard-overridden');
const postcssNormalizeRepeatStyle = require('postcss-normalize-repeat-style');
const postcssMergeRules = require('postcss-merge-rules');
const postcssDiscardEmpty = require('postcss-discard-empty');
const postcssUniqueSelectors = require('postcss-unique-selectors');
const postcssNormalizeString = require('postcss-normalize-string');
const postcssNormalizePositions = require('postcss-normalize-positions');
const postcssNormalizeWhitespace = require('postcss-normalize-whitespace');
// const postcssNormalizeUnicode = require('postcss-normalize-unicode');
const postcssNormalizeDisplayValues = require('postcss-normalize-display-values');
// const postcssNormalizeTimingFunctions = require('postcss-normalize-timing-functions');
const rawCache = require('cssnano-util-raw-cache');

const defaultOpts = {
  convertValues: {
    length: false,
  },
//   normalizeCharset: {
//     add: false,
//   },
  cssDeclarationSorter: {
    exclude: true,
  },
};

module.exports = function defaultPreset (opts = {}) {
  const options = Object.assign({}, defaultOpts, opts);

  const plugins = [
    [postcssDiscardComments, options.discardComments],
    [postcssMinifyGradients, options.minifyGradients],
    [postcssReduceInitial, options.reduceInitial],
    // [postcssSvgo, options.svgo],
    [postcssNormalizeDisplayValues, options.normalizeDisplayValues],
    [postcssReduceTransforms, options.reduceTransforms],
    [postcssColormin, options.colormin],
    // [postcssNormalizeTimingFunctions, options.normalizeTimingFunctions],
    // [postcssCalc, options.calc],
    [postcssConvertValues, options.convertValues],
    [postcssOrderedValues, options.orderedValues],
    [postcssMinifySelectors, options.minifySelectors],
    [postcssMinifyParams, options.minifyParams],
    // [postcssNormalizeCharset, options.normalizeCharset],
    // [postcssDiscardOverridden, options.discardOverridden],
    [postcssNormalizeString, options.normalizeString],
    // [postcssNormalizeUnicode, options.normalizeUnicode],
    [postcssMinifyFontValues, options.minifyFontValues],
    [postcssNormalizeUrl, options.normalizeUrl],
    [postcssNormalizeRepeatStyle, options.normalizeRepeatStyle],
    [postcssNormalizePositions, options.normalizePositions],
    [postcssNormalizeWhitespace, options.normalizeWhitespace],
    // [postcssMergeLonghand, options.mergeLonghand],
    [postcssDiscardDuplicates, options.discardDuplicates],
    [postcssMergeRules, options.mergeRules],
    [postcssDiscardEmpty, options.discardEmpty],
    [postcssUniqueSelectors, options.uniqueSelectors],
    // [cssDeclarationSorter, options.cssDeclarationSorter],
    [rawCache, options.rawCache],
  ];

  return {plugins};
}
